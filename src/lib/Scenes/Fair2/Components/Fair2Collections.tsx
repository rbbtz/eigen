import { ActionType, ContextModule, OwnerType, TappedCollectionGroup } from "@artsy/cohesion"
import { Fair2Collections_fair } from "__generated__/Fair2Collections_fair.graphql"
import { CARD_WIDTH } from "lib/Components/Home/CardRailCard"
import { CardRailFlatList } from "lib/Components/Home/CardRailFlatList"
import { navigate } from "lib/navigation/navigate"
import { compact } from "lodash"
import { Box, BoxProps, SmallCard, Text, TouchableWithScale } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

type Collection = Fair2Collections_fair["marketingCollections"][number]

interface Fair2CollectionsProps extends BoxProps {
  fair: Fair2Collections_fair
}

export const Fair2Collections: React.FC<Fair2CollectionsProps> = ({ fair, ...rest }) => {
  const tracking = useTracking()

  const trackTappedCollection = (collectionID: string, collectionSlug: string) => {
    const trackTappedCollectionProps: TappedCollectionGroup = {
      action: ActionType.tappedCollectionGroup,
      context_module: ContextModule.curatedHighlightsRail,
      context_screen_owner_type: OwnerType.fair,
      context_screen_owner_id: fair.internalID,
      context_screen_owner_slug: fair.slug,
      destination_screen_owner_type: OwnerType.collection,
      destination_screen_owner_id: collectionID,
      destination_screen_owner_slug: collectionSlug,
      type: "thumbnail",
    }
    tracking.trackEvent(trackTappedCollectionProps)
  }

  if (fair.marketingCollections.length === 0) {
    return null
  }

  return (
    <Box {...rest}>
      <Text mx={2} mb={2} variant="subtitle">
        Curated Highlights
      </Text>

      <CardRailFlatList<Collection>
        data={fair.marketingCollections}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item: collection }) => {
          if (!collection?.artworks?.edges) {
            return null
          }

          const images = compact(collection.artworks.edges.map((edge) => edge?.node?.image?.url))

          return (
            <TouchableWithScale
              key={collection.slug}
              onPress={() => {
                trackTappedCollection(collection.internalID, collection.slug)
                navigate(`/collection/${collection.slug}`)
              }}
            >
              <SmallCard width={CARD_WIDTH} images={images} title={collection.title} subtitle={collection.category} />
            </TouchableWithScale>
          )
        }}
      />
    </Box>
  )
}

export const Fair2CollectionsFragmentContainer = createFragmentContainer(Fair2Collections, {
  fair: graphql`
    fragment Fair2Collections_fair on Fair {
      internalID
      slug
      marketingCollections(size: 4) {
        internalID
        slug
        title
        category
        artworks: artworksConnection(first: 3) {
          edges {
            node {
              image {
                url(version: "larger")
              }
            }
          }
        }
      }
    }
  `,
})
