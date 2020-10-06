import { render } from "@testing-library/react-native"
import { AppStoreProvider } from "lib/store/AppStore"
import { Theme } from "palette"
import React from "react"
import ReactTestRenderer from "react-test-renderer"
import { ReactElement } from "simple-markdown"

export const Wrappers: React.FC = ({ children }) => {
  return (
    <AppStoreProvider>
      <Theme>{children}</Theme>
    </AppStoreProvider>
  )
}

/**
 * Returns given component wrapped with our page wrappers
 * @param component
 */
export const componentWithWrappers = (component: ReactElement) => {
  return <Wrappers>{component}</Wrappers>
}

/**
 * Renders a React Component with our page wrappers
 * @param component
 */
export const renderWithWrappers = (component: ReactElement) => {
  const wrappedComponent = componentWithWrappers(component)
  // tslint:disable-next-line:use-wrapped-components
  const renderedComponent = ReactTestRenderer.create(wrappedComponent)

  // monkey patch update method to wrap components
  const originalUpdate = renderedComponent.update
  renderedComponent.update = (nextElement: ReactElement) => {
    originalUpdate(componentWithWrappers(nextElement))
  }

  return renderedComponent
}

/**
 * Renders a React Component with our page wrappers
 * @param component
 */
export const renderWithWrappersTL = (component: ReactElement) => {
  return render(component, { wrapper: Wrappers })
}
