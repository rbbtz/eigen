#import "ARTopMenuViewController+DeveloperExtras.h"
#import "ARContentViewControllers.h"
#import "ARAppStatus.h"
#import "ArtsyEcho.h"

#import "UIViewController+FullScreenLoading.h"
#import "ARTabContentView.h"
#import "ARTopMenuNavigationDataSource.h"
#import "ARUserManager.h"
#import "ArtsyAPI+Private.h"
#import "ARAppConstants.h"
#import "ARAnalyticsConstants.h"
#import "ARFonts.h"
#import "User.h"
#import "ARAppNotificationsDelegate.h"

#import "UIView+HitTestExpansion.h"
#import <objc/runtime.h>
#import "UIDevice-Hardware.h"
#import "Artsy-Swift.h"

#import <NPKeyboardLayoutGuide/NPKeyboardLayoutGuide.h>
#import <Artsy-UIButtons/ARButtonSubclasses.h>
#import <UIView+BooleanAnimations/UIView+BooleanAnimations.h>
#import <objc/runtime.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <FLKAutoLayout/UIViewController+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>


#import <Emission/ARMapContainerViewController.h>
#import <Emission/ARBidFlowViewController.h>
#import <Emission/AREmission.h>
#import <Emission/ARNotificationsManager.h>
#import <React/RCTScrollView.h>

@interface ARTopMenuViewController () <ARTabViewDelegate>

@property (readwrite, nonatomic, strong) ARTopMenuNavigationDataSource *navigationDataSource;

@property (readwrite, nonatomic, assign) NSString * currentTab;

@property (readonly, nonatomic, strong) ArtsyEcho *echo;

// we need to wait for the view to load before we push a deep link VC on startup
@property (readwrite, nonatomic, strong) NSMutableArray<void (^)(void)> *bootstrapQueue;
@property (readwrite, nonatomic, assign) BOOL didBootstrap;
@end

static ARTopMenuViewController *_sharedManager = nil;

@implementation ARTopMenuViewController

+ (ARTopMenuViewController *)sharedController
{
    if (_sharedManager == nil) {
        _sharedManager = [[self alloc] init];
    }
    return _sharedManager;
}

+ (void)teardownSharedInstance
{
    _sharedManager = nil;
}

- (instancetype)init {
    self = [super init];
    if (!self) {
        return self;
    }

    _didBootstrap = NO;
    _bootstrapQueue = [[NSMutableArray alloc] init];

    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    _echo = [[ArtsyEcho alloc] init];

    self.view.backgroundColor = [UIColor whiteColor];

    self.navigationDataSource = _navigationDataSource ?: [[ARTopMenuNavigationDataSource alloc] init];

    ARTabContentView *tabContentView = [[ARTabContentView alloc] initWithFrame:CGRectZero
                                                            hostViewController:self
                                                                      delegate:self
                                                                    dataSource:self.navigationDataSource];

    _tabContentView = tabContentView;
    [self.view addSubview:tabContentView];
    [tabContentView alignToView:self.view];
    self.currentTab = [ARTabType home];
    [self.tabContentView forceSetCurrentTab:[ARTabType home] animated:NO];

    // Ensure it's created now and started listening for keyboard changes.
    // TODO Ideally this pod would start listening from launch of the app, so we don't need to rely on this one but can
    // be assured that any VCs guide can be trusted.
    (void)self.keyboardLayoutGuide;

    self.didBootstrap = YES;
    __weak typeof(self) wself = self;
    dispatch_async(dispatch_get_main_queue(), ^() {
        __strong typeof(self) sself = wself;
        if (!sself) {
            return;
        }
        while (self.bootstrapQueue.count > 0) {
            void (^completion)(void) = [self.bootstrapQueue firstObject];
            [self.bootstrapQueue removeObjectAtIndex:0];
            completion();
        }
    });
}


- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator
{
    [super viewWillTransitionToSize:size withTransitionCoordinator:coordinator];
    [self.view layoutSubviews];
}

- (ARNavigationController *)rootNavigationController;
{
    return (ARNavigationController *)[self.tabContentView currentNavigationController];
}

- (ARNavigationController *)rootNavigationControllerAtTab:(NSString *)tab;
{
    return (ARNavigationController *)[self.navigationDataSource navigationControllerForTabType:tab];
}

#pragma mark - Buttons

- (CGFloat)bottomMargin
{
    return self.view.safeAreaInsets.bottom * -1;
}

#pragma mark - ARMenuAwareViewController

- (BOOL)hidesNavigationButtons
{
    return YES;
}

#pragma mark - UIViewController

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];

    // Essentially the else part of the check in viewDidLoad
    // If not coming from a new account (with animation), then prompt for push on the usual constraints
    if (!([[NSUserDefaults standardUserDefaults] integerForKey:AROnboardingUserProgressionStage] == AROnboardingStageOnboarding)) {
        ARAppNotificationsDelegate *remoteNotificationsDelegate = [[JSDecoupledAppDelegate sharedAppDelegate] remoteNotificationsDelegate];
        [remoteNotificationsDelegate registerForDeviceNotificationsWithContext:ARAppNotificationsRequestContextOnboarding];
    }

#ifdef DEBUG
    if ([ARAppStatus isRunningTests] == NO) {
        static dispatch_once_t onceToken;
        dispatch_once(&onceToken, ^{
            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appHasBeenInjected:) name:@"INJECTION_BUNDLE_NOTIFICATION" object:nil];

            [self runSwiftDeveloperExtras];
            [self runDeveloperExtras];
        });
    }
#endif
}

- (UIViewController *)childViewControllerForStatusBarHidden
{
    return self.rootNavigationController;
}

- (UIViewController *)childViewControllerForStatusBarStyle
{
    return self.rootNavigationController;
}

#pragma mark - Pushing VCs

- (void)pushViewController:(UIViewController *)viewController
{
    [self pushViewController:viewController animated:ARPerformWorkAsynchronously];
}

- (void)pushViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    [self pushViewController:viewController animated:animated completion:nil];
}

- (void)pushViewController:(__strong UIViewController *)viewController animated:(BOOL)animated completion:(void (^__nullable)(void))completion
{
    __weak typeof(self) wself = self;
    [self afterBootstrap:^{
        __strong typeof(self) sself = wself;
        if (!sself) return;
        [sself pushViewControllerNow:viewController animated:animated completion:completion];
    }];
}

- (void)afterBootstrap:(void (^)(void))completion {
    if (self.didBootstrap) {
        completion();
    } else {
        [self.bootstrapQueue addObject:completion];
    }
}

- (void)pushViewControllerNow:(UIViewController *)viewController animated:(BOOL)animated completion:(void (^__nullable)(void))completion
{
    NSAssert(viewController != nil, @"Attempt to push a nil view controller.");
    [self.rootNavigationController pushViewController:viewController animated:animated];
}

- (void)presentRootViewControllerInTab:(NSString *)tabType animated:(BOOL)animated props:(NSDictionary *)props;
{
    __weak typeof(self) wself = self;
    [self afterBootstrap:^{
        __strong typeof(self) sself = wself;
        if (!sself) return;
        [sself presentRootViewControllerInTabNow:tabType animated:animated props:props];
    }];
}

- (void)presentRootViewControllerInTabNow:(NSString *)tabType animated:(BOOL)animated props:(NSDictionary *)props;
{
    BOOL alreadySelectedTab = [self.currentTab isEqual:tabType];
    ARNavigationController *controller = [self rootNavigationControllerAtTab:tabType];

    if (!alreadySelectedTab) {
        [self.tabContentView setCurrentTab:tabType animated:animated];
        self.currentTab = tabType;
    } else if (controller.viewControllers.count > 1) {
        [controller popToRootViewControllerAnimated:(animated && alreadySelectedTab)];
    }
    // Otherwise find the first scrollview and pop to top
    else {
        UIViewController *currentRootViewController = [controller.childViewControllers first];
        UIScrollView *rootScrollView = (id)[self firstScrollToTopScrollViewFromRootView:currentRootViewController.view];
        [rootScrollView setContentOffset:CGPointMake(rootScrollView.contentOffset.x, -rootScrollView.contentInset.top) animated:YES];
    }
    if ([controller.rootViewController isKindOfClass:ARComponentViewController.class]) {
        ARComponentViewController *vc = (ARComponentViewController *)controller.rootViewController;
        [props each:^(id key, id value) {
            [vc setProperty:value forKey:key];
        }];
    }
}


#pragma mark - Auto Rotation

// Let the nav decide what rotations to support

- (BOOL)shouldAutorotate
{
    return [self.rootNavigationController shouldAutorotate];
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
    return self.rootNavigationController.supportedInterfaceOrientations ?: ([UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskPortrait);
}

- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation
{
    return self.rootNavigationController.preferredInterfaceOrientationForPresentation ?: UIInterfaceOrientationPortrait;
}

#pragma mark - ARTabViewDelegate

- (void)tabContentView:(ARTabContentView *)tabContentView didChangeToTab:(NSString *)tabType
{
    [[AREmission sharedInstance] updateState:@{[ARStateKey selectedTab]: tabType}];
}

- (NSObject *_Nullable)firstScrollToTopScrollViewFromRootView:(UIView *)initialView
{
    UIView *rootView = initialView;
    if ([rootView isKindOfClass:UIScrollView.class] && [(id)rootView scrollsToTop] && [(UIScrollView *)rootView contentOffset].y > 0) {
        return rootView;
    }

    for (UIView* childView in rootView.subviews) {
        NSObject* result = [self firstScrollToTopScrollViewFromRootView:childView];
        if (result) {
            return result;
        }
    }

    return nil;
}

@end
