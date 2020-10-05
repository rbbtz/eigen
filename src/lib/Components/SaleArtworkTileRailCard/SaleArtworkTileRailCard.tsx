import { SaleArtworkTileRailCard_saleArtwork } from "__generated__/SaleArtworkTileRailCard_saleArtwork.graphql"
import { Box, color, Flex, Sans } from "palette"
import React from "react"
import { GestureResponderEvent } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"
import { saleMessageOrBidInfo } from "../ArtworkGrids/ArtworkGridItem"
import OpaqueImageView from "../OpaqueImageView/OpaqueImageView"

export const CONTAINER_HEIGHT = 120

const SaleArtworkCard = styled.TouchableHighlight.attrs({ underlayColor: color("white100"), activeOpacity: 0.8 })``

export interface SaleArtworkTileRailCardProps {
  onPress: ((event: GestureResponderEvent) => void) | null | undefined
  saleArtwork: SaleArtworkTileRailCard_saleArtwork
  useCustomSaleMessage?: boolean
  useSquareAspectRatio?: boolean
}

export const SaleArtworkTileRailCard: React.FC<SaleArtworkTileRailCardProps> = ({
  onPress,
  saleArtwork,
  useCustomSaleMessage = false,
  useSquareAspectRatio = false,
}) => {
  const artwork = saleArtwork.artwork!

  if (!!artwork.image?.imageURL && !artwork.image?.aspectRatio && !useSquareAspectRatio) {
    throw new Error("imageAspectRatio is required for non-square images")
  }

  const imageWidth = useSquareAspectRatio ? CONTAINER_HEIGHT : (artwork.image?.aspectRatio ?? 1) * CONTAINER_HEIGHT

  const imageDisplay = artwork.image?.imageURL ? (
    <OpaqueImageView
      imageURL={artwork.image.imageURL}
      width={imageWidth}
      height={CONTAINER_HEIGHT}
      style={{
        borderRadius: 2,
        overflow: "hidden",
        justifyContent: "flex-end",
        paddingHorizontal: 5,
        paddingBottom: 5,
      }}
    />
  ) : (
    <Box bg={color("black30")} width={CONTAINER_HEIGHT} height={CONTAINER_HEIGHT} style={{ borderRadius: 2 }} />
  )

  const artistNamesDisplay = artwork.artistNames ? (
    <Sans size="3t" weight="medium" color="black100" numberOfLines={1}>
      {artwork.artistNames}
    </Sans>
  ) : null

  const saleMessageDisplay = artwork.saleMessage ? (
    <Sans size="3t" color="black60" numberOfLines={1}>
      {artwork.saleMessage}
    </Sans>
  ) : null

  const customSaleMessage = saleMessageOrBidInfo({
    artwork: {
      sale: saleArtwork.sale,
      saleArtwork,
      saleMessage: saleArtwork.artwork?.saleMessage || null,
    },
    isSmallTile: true,
  })

  const customSaleMessageDisplay = useCustomSaleMessage ? (
    <Sans size="3t" color="black60" numberOfLines={1}>
      {customSaleMessage}
    </Sans>
  ) : null

  const titleAndDateDisplay =
    artwork.title || artwork.date ? (
      <Sans size="3t" color="black60" numberOfLines={1}>
        {[artwork.title, artwork.date].filter(Boolean).join(", ")}
      </Sans>
    ) : null

  const lotNumber = saleArtwork.lotLabel ? (
    <Sans size="3t" color="black60" numberOfLines={1}>
      Lot {saleArtwork.lotLabel}
    </Sans>
  ) : null

  return (
    <SaleArtworkCard onPress={onPress || undefined}>
      <Flex>
        {imageDisplay}
        <Box mt={1} width={CONTAINER_HEIGHT}>
          {lotNumber}
          {artistNamesDisplay}
          {titleAndDateDisplay}
          {customSaleMessage ? customSaleMessageDisplay : saleMessageDisplay}
        </Box>
      </Flex>
    </SaleArtworkCard>
  )
}

export const SaleArtworkTileRailCardContainer = createFragmentContainer(SaleArtworkTileRailCard, {
  saleArtwork: graphql`
    fragment SaleArtworkTileRailCard_saleArtwork on SaleArtwork {
      artwork {
        artistNames
        date
        href
        image {
          imageURL: url(version: "small")
          aspectRatio
        }
        internalID
        slug
        saleMessage
        title
      }
      counts {
        bidderPositions
      }
      currentBid {
        display
      }
      lotLabel
      sale {
        isAuction
        isClosed
        displayTimelyAt
      }
    }
  `,
})
