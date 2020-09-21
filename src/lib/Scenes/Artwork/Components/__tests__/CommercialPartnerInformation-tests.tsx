import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Text } from "react-native"
import { CommercialPartnerInformation } from "../CommercialPartnerInformation"

describe("CommercialPartnerInformation", () => {
  it("renders all seller information when work is for sale and is not in a closed auction", () => {
    const tree = renderWithWrappers(
      <CommercialPartnerInformation
        // @ts-ignore STRICTNESS_MIGRATION
        artwork={CommercialPartnerInformationArtwork}
      />
    ).root

    expect(tree.findAllByType(Text)[0].props.children.join("")).toMatch("From Bob's Gallery")
    expect(tree.findAllByType(Text)[1].props.children.join("")).toMatch("Ships from Brooklyn")
    expect(tree.findAllByType(Text)[2].props.children).toMatch("Ships within the continental USA")
    expect(tree.findAllByType(Text)[3].props.children).toMatch("VAT included in price")
  })

  it("hides shipping info for works from closed auctions", () => {
    const CommercialPartnerInformationArtworkClosedAuction = {
      ...CommercialPartnerInformationArtwork,
      availability: "not for sale",
      isForSale: false,
      isOfferable: false,
      isAcquireable: false,
    }
    const tree = renderWithWrappers(
      <CommercialPartnerInformation
        // @ts-ignore STRICTNESS_MIGRATION
        artwork={CommercialPartnerInformationArtworkClosedAuction}
      />
    ).root

    expect(tree.findAllByType(Text).length).toEqual(1)
    expect(tree.findAllByType(Text)[0].props.children.join("")).toMatch("At Bob's Gallery")
  })

  it("hides shipping information for sold works", () => {
    const CommercialPartnerInformationArtworkClosedAuction = {
      ...CommercialPartnerInformationArtwork,
      availability: "sold",
      isForSale: false,
      isOfferable: false,
      isAcquireable: false,
    }
    const tree = renderWithWrappers(
      <CommercialPartnerInformation
        // @ts-ignore STRICTNESS_MIGRATION
        artwork={CommercialPartnerInformationArtworkClosedAuction}
      />
    ).root

    expect(tree.findAllByType(Text).length).toEqual(1)
    expect(tree.findAllByType(Text)[0].props.children.join("")).toMatch("From Bob's Gallery")
  })

  it("Hides shipping/tax information if the work is not enabled for buy now or make offer", () => {
    const CommercialPartnerInformationNoEcommerce = {
      ...CommercialPartnerInformationArtwork,
      isAcquireable: false,
      isOfferable: false,
    }

    const tree = renderWithWrappers(
      <CommercialPartnerInformation
        // @ts-ignore STRICTNESS_MIGRATION
        artwork={CommercialPartnerInformationNoEcommerce}
      />
    ).root

    expect(tree.findAllByType(Text).length).toEqual(1)
    expect(tree.findAllByType(Text)[0].props.children.join("")).toMatch("From Bob's Gallery")
  })

  it("Says 'At Gallery Name' instead of 'From Gallery Name' and hides shipping info for non-commercial works", () => {
    const CommercialPartnerInformationArtworkClosedAuction = {
      ...CommercialPartnerInformationArtwork,
      availability: null,
      isForSale: false,
      isOfferable: false,
      isAcquireable: false,
    }
    const tree = renderWithWrappers(
      <CommercialPartnerInformation
        // @ts-ignore STRICTNESS_MIGRATION
        artwork={CommercialPartnerInformationArtworkClosedAuction}
      />
    ).root

    expect(tree.findAllByType(Text).length).toEqual(1)
    expect(tree.findAllByType(Text)[0].props.children.join("")).toMatch("At Bob's Gallery")
  })
})

const CommercialPartnerInformationArtwork = {
  availability: "for sale",
  isAcquireable: true,
  isForSale: true,
  isOfferable: false,
  shippingOrigin: "Brooklyn",
  shippingInfo: "Ships within the continental USA",
  partner: {
    name: "Bob's Gallery",
  },
  priceIncludesTaxDisplay: "VAT included in price",
  " $refType": null,
}
