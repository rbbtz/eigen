import { SaleArtworkListItem_artwork } from "__generated__/SaleArtworkListItem_artwork.graphql"
import { saleMessageOrBidInfo } from "lib/Components/ArtworkGrids/ArtworkGridItem"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Flex, Sans } from "palette"
import { Touchable } from "palette"
import React, { useRef } from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  artwork: SaleArtworkListItem_artwork
}

const CONTAINER_HEIGHT = 100

export const SaleArtworkListItem: React.FC<Props> = ({ artwork }) => {
  const itemRef = useRef<any>()

  const onPress = () => {
    SwitchBoard.presentNavigationViewController(itemRef.current!, artwork.href!)
  }
  const saleInfo = saleMessageOrBidInfo({ artwork })

  const imageDimensions = getImageDimensions(artwork.image?.height, artwork.image?.width)

  return (
    <Touchable onPress={onPress}>
      <Flex flexDirection="row" alignItems="center" height={CONTAINER_HEIGHT} ref={itemRef}>
        {!!artwork.image && (
          <Flex height={CONTAINER_HEIGHT} width={CONTAINER_HEIGHT} alignItems="center" justifyContent="center">
            <OpaqueImageView
              imageURL={artwork.image?.small}
              height={imageDimensions.height}
              width={imageDimensions.width}
              aspectRatio={artwork.image?.aspectRatio ?? 1}
            />
          </Flex>
        )}

        <Flex ml={2} height={100} flex={1}>
          {!!artwork.saleArtwork?.lotLabel && (
            <Sans size="3t" color="black60" numberOfLines={1}>
              Lot {artwork.saleArtwork.lotLabel}
            </Sans>
          )}
          {!!artwork.artistNames && (
            <Sans size="3t" weight="medium" numberOfLines={1}>
              {artwork.artistNames}
            </Sans>
          )}
          {!!artwork.title && (
            <Sans size="3t" color="black60" numberOfLines={2}>
              {artwork.title}
              {!!artwork.date && `, ${artwork.date}`}
            </Sans>
          )}
          {!!saleInfo && (
            <Sans color="black60" size="3t" numberOfLines={1}>
              {saleInfo}
            </Sans>
          )}
        </Flex>
      </Flex>
    </Touchable>
  )
}

// Get image accurate square dimensions while keeping the same aspect ratio
const getImageDimensions = (height?: number | null, width?: number | null) => {
  if (height && width) {
    if (height > width) {
      return {
        height: CONTAINER_HEIGHT,
        width: (width * CONTAINER_HEIGHT) / height,
      }
    }
    return {
      height: (height * CONTAINER_HEIGHT) / width,
      width: CONTAINER_HEIGHT,
    }
  }
  return {
    height: CONTAINER_HEIGHT,
    width: CONTAINER_HEIGHT,
  }
}

export const SaleArtworkListItemContainer = createFragmentContainer(SaleArtworkListItem, {
  artwork: graphql`
    fragment SaleArtworkListItem_artwork on Artwork {
      title
      date
      saleMessage
      slug
      internalID
      artistNames
      href
      sale {
        isAuction
        isClosed
        displayTimelyAt
        endAt
      }
      saleArtwork {
        counts {
          bidderPositions
        }
        currentBid {
          display
        }
        lotLabel
      }
      image {
        small: url(version: "small")
        aspectRatio
        height
        width
      }
    }
  `,
})
