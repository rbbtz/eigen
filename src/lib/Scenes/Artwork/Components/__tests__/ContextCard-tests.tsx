import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Box, Button, EntityHeader } from "palette"
import React from "react"
import { Image, Text } from "react-native"
import { RelayProp } from "react-relay"
import { ContextCard } from "../ContextCard"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

jest.unmock("react-relay")

describe("ContextCard", () => {
  describe("Fair context", () => {
    it("renders fair name correctly", () => {
      const tree = renderWithWrappers(
        <ContextCard relay={{ environment: {} } as RelayProp} artwork={fairContextArtwork as any} />
      ).root

      expect(tree.findAllByType(EntityHeader).length).toEqual(1)
      expect(tree.findAllByType(EntityHeader)[0].props.name).toMatch("Market Art + Design 2019")
    })

    it("renders fair image", () => {
      const tree = renderWithWrappers(
        <ContextCard relay={{ environment: {} } as RelayProp} artwork={fairContextArtwork as any} />
      ).root

      expect(tree.findAllByType(Image)).toHaveLength(1)
    })
  })

  describe("Show context", () => {
    it("renders show name correctly", () => {
      const tree = renderWithWrappers(
        <ContextCard relay={{ environment: {} } as RelayProp} artwork={showContextArtwork as any} />
      ).root

      expect(tree.findAllByType(EntityHeader).length).toEqual(1)
      expect(tree.findAllByType(EntityHeader)[0].props.name).toMatch("Time Lapse")
    })

    it("renders show image", () => {
      const tree = renderWithWrappers(
        <ContextCard relay={{ environment: {} } as RelayProp} artwork={showContextArtwork as any} />
      ).root

      expect(tree.findAllByType(Image)).toHaveLength(1)
    })

    it("renders show button text correctly", () => {
      const tree = renderWithWrappers(
        <ContextCard relay={{ environment: {} } as RelayProp} artwork={showContextArtwork as any} />
      ).root

      expect(tree.findAllByType(Button)).toHaveLength(1)
      expect(tree.findAllByType(Button)[0].props.children).toMatch("Follow")
    })
  })

  describe("Sale context", () => {
    it("renders sale name correctly", () => {
      const tree = renderWithWrappers(
        <ContextCard relay={{ environment: {} } as RelayProp} artwork={auctionContextArtwork as any} />
      ).root

      expect(tree.findAllByType(EntityHeader).length).toEqual(1)
      expect(tree.findAllByType(EntityHeader)[0].props.name).toMatch("Christie’s: Prints & Multiples")
    })

    it("renders formatted sale start/end date correctly", () => {
      const tree = renderWithWrappers(
        <ContextCard relay={{ environment: {} } as RelayProp} artwork={auctionContextArtwork as any} />
      ).root

      expect(tree.findAllByType(EntityHeader).length).toEqual(1)
      expect(tree.findAllByType(EntityHeader)[0].props.meta).toMatch("Ended Oct 25, 2018")
    })

    it("if auction is live display in progress", () => {
      const saleContextArtwork = {
        ...auctionContextArtwork,
        context: {
          ...auctionContextArtwork.context,
          formattedStartDateTime: "In progress",
        },
      }
      const tree = renderWithWrappers(
        <ContextCard relay={{ environment: {} } as RelayProp} artwork={saleContextArtwork as any} />
      ).root

      expect(tree.findAllByType(EntityHeader).length).toEqual(1)
      expect(tree.findAllByType(EntityHeader)[0].props.meta).toMatch("In progress")
    })

    it("renders sale image", () => {
      const tree = renderWithWrappers(
        <ContextCard relay={{ environment: {} } as RelayProp} artwork={auctionContextArtwork as any} />
      ).root

      expect(tree.findAllByType(Image)).toHaveLength(1)
    })

    it("renders 'In Auction' if the sale is an auction", () => {
      const tree = renderWithWrappers(
        <ContextCard relay={{ environment: {} } as RelayProp} artwork={auctionContextArtwork as any} />
      ).root

      expect(tree.findAllByType(Text)[0].props.children).toMatch("In auction")
    })

    it("renders nothing if the sale is not an auction", () => {
      const saleContextArtwork = {
        ...auctionContextArtwork,
        context: {
          ...auctionContextArtwork.context,
          isAuction: false,
        },
      }
      const tree = renderWithWrappers(
        <ContextCard relay={{ environment: {} } as RelayProp} artwork={saleContextArtwork as any} />
      ).root

      expect(tree.findAllByType(Box).length).toBe(0)
    })
  })
})

const fairContextArtwork = {
  id: "QXJ0d29yazpjYW5kaWNlLWNtYy1zdXBlcm1hbi1kb251dHMtMQ==",
  gravityID: "candice-cmc-superman-donuts-1",
  internalID: "5d0a7485fc1f78001248b677",
  context: {
    __typename: "Fair",
    id: "QXJ0d29ya0NvbnRleHRGYWlyOm1hcmtldC1hcnQtcGx1cy1kZXNpZ24tMjAxOQ==",
    name: "Market Art + Design 2019",
    href: "/market-art-plus-design-2019",
    exhibition_period: "Jul 5 – 7",
    image: {
      url: "https://d32dm0rphc51dk.cloudfront.net/R5z4lkyH6DyGhEwAg44NSA/wide.jpg",
    },
  },
  " $refType": null,
  " $fragmentRefs": null,
}

const auctionContextArtwork = {
  id: "QXJ0d29yazphbmR5LXdhcmhvbC1tYW8tb25lLXBsYXRlLTM=",
  gravityID: "andy-warhol-mao-one-plate-3",
  internalID: "5bc13101c8d4326cc288ecb8",
  context: {
    __typename: "Sale",
    isLiveOpen: false,
    id: "QXJ0d29ya0NvbnRleHRBdWN0aW9uOmNocmlzdGllcy1wcmludHMtYW5kLW11bHRpcGxlcy02",
    name: "Christie’s: Prints & Multiples",
    href: "/auction/christies-prints-and-multiples-6",
    isAuction: true,
    formattedStartDateTime: "Ended Oct 25, 2018",
    coverImage: {
      url: "https://d32dm0rphc51dk.cloudfront.net/bMu0vqXOVlpABBsWVxVIJA/large_rectangle.jpg",
    },
  },
  shows: [],
  fair: null,
  " $refType": null,
  " $fragmentRefs": null,
}

const showContextArtwork = {
  id: "QXJ0d29yazphYmJhcy1raWFyb3N0YW1pLXVudGl0bGVkLTc=",
  gravityID: "abbas-kiarostami-untitled-7",
  internalID: "5b2b745e9c18db204fc32e11",
  context: {
    __typename: "Show",
    id: "U2hvdzpjYW1hLWdhbGxlcnktMS10aW1lLWxhcHNl",
    name: "Time Lapse",
    href: "/show/cama-gallery-1-time-lapse",
    gravityID: "cama-gallery-1-time-lapse",
    internalID: "5b335e329c18db4a5a5015cc",
    exhibition_period: "Jun 22 – Jul 3, 2018",
    is_followed: null,
    coverImage: {
      url: "https://d32dm0rphc51dk.cloudfront.net/MYRUdCdCDdpU9dLTcmDX0A/medium.jpg",
    },
  },
  fair: null,
  " $refType": null,
  " $fragmentRefs": null,
}
