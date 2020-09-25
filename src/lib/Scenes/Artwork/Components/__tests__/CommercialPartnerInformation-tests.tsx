import { renderWithWrappers2 } from "lib/tests/renderWithWrappers"
import React from "react"
import { Text } from "react-native"
import { CommercialPartnerInformation } from "../CommercialPartnerInformation"

describe("CommercialPartnerInformation", () => {
  it("renders all seller information when work is for sale and is not in a closed auction", () => {
    const tree = renderWithWrappers2(
      <CommercialPartnerInformation
        // @ts-ignore STRICTNESS_MIGRATION
        artwork={CommercialPartnerInformationArtwork}
      />
    )

    expect(tree.getByText("From Bob's Gallery")).toBeTruthy()
    expect(tree.getByText("Ships from Brooklyn")).toBeTruthy()
    expect(tree.getByText("Ships within the continental USA")).toBeTruthy()
    expect(tree.getByText("VAT included in price")).toBeTruthy()
  })

  it("hides shipping info for works from closed auctions", () => {
    const CommercialPartnerInformationArtworkClosedAuction = {
      ...CommercialPartnerInformationArtwork,
      availability: "not for sale",
      isForSale: false,
      isOfferable: false,
      isAcquireable: false,
    }
    const tree = renderWithWrappers2(
      <CommercialPartnerInformation
        // @ts-ignore STRICTNESS_MIGRATION
        artwork={CommercialPartnerInformationArtworkClosedAuction}
      />
    )

    expect(tree.UNSAFE_getAllByType(Text)).toHaveLength(1)
    expect(tree.getByText("At Bob's Gallery")).toBeTruthy()
  })

  it("hides shipping information for sold works", () => {
    const CommercialPartnerInformationArtworkClosedAuction = {
      ...CommercialPartnerInformationArtwork,
      availability: "sold",
      isForSale: false,
      isOfferable: false,
      isAcquireable: false,
    }
    const tree = renderWithWrappers2(
      <CommercialPartnerInformation
        // @ts-ignore STRICTNESS_MIGRATION
        artwork={CommercialPartnerInformationArtworkClosedAuction}
      />
    )

    expect(tree.UNSAFE_getAllByType(Text)).toHaveLength(1)
    expect(tree.getByText("From Bob's Gallery")).toBeTruthy()
  })

  it("Hides shipping/tax information if the work is not enabled for buy now or make offer", () => {
    const CommercialPartnerInformationNoEcommerce = {
      ...CommercialPartnerInformationArtwork,
      isAcquireable: false,
      isOfferable: false,
    }

    const tree = renderWithWrappers2(
      <CommercialPartnerInformation
        // @ts-ignore STRICTNESS_MIGRATION
        artwork={CommercialPartnerInformationNoEcommerce}
      />
    )

    expect(tree.UNSAFE_getAllByType(Text)).toHaveLength(1)
    expect(tree.getByText("From Bob's Gallery")).toBeTruthy()
  })

  it("Says 'At Gallery Name' instead of 'From Gallery Name' and hides shipping info for non-commercial works", () => {
    const CommercialPartnerInformationArtworkClosedAuction = {
      ...CommercialPartnerInformationArtwork,
      availability: null,
      isForSale: false,
      isOfferable: false,
      isAcquireable: false,
    }
    const tree = renderWithWrappers2(
      <CommercialPartnerInformation
        // @ts-ignore STRICTNESS_MIGRATION
        artwork={CommercialPartnerInformationArtworkClosedAuction}
      />
    )

    expect(tree.UNSAFE_getAllByType(Text)).toHaveLength(1)
    expect(tree.getByText("At Bob's Gallery")).toBeTruthy()
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
