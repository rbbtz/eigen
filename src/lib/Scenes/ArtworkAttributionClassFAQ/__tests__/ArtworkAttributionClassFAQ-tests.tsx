import { fireEvent } from "@testing-library/react-native"
import React from "react"
import { Text } from "react-native"

import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { renderWithWrappers2 } from "lib/tests/renderWithWrappers"

import { ArtworkAttributionClassFAQ } from "../ArtworkAttributionClassFAQ"

jest.mock("lib/NativeModules/SwitchBoard", () => ({ dismissNavigationViewController: jest.fn() }))

describe("ArtworkAttributionClassFAQ", () => {
  it("renders FAQ header", () => {
    const tree = renderWithWrappers2(
      <ArtworkAttributionClassFAQ
        safeAreaInsets={{ top: 20, left: 0, right: 0, bottom: 0 }}
        // @ts-ignore STRICTNESS_MIGRATION
        artworkAttributionClasses={attributionClasses}
      />
    )

    expect(tree.getByText("Artwork classifications")).toBeTruthy()
  })

  it("renders OK button", () => {
    const tree = renderWithWrappers2(
      <ArtworkAttributionClassFAQ
        safeAreaInsets={{ top: 20, left: 0, right: 0, bottom: 0 }}
        // @ts-ignore STRICTNESS_MIGRATION
        artworkAttributionClasses={attributionClasses}
      />
    )

    expect(tree.getByTestId("okButton")).toBeTruthy()
  })

  it("renders attribution classes", () => {
    const tree = renderWithWrappers2(
      <ArtworkAttributionClassFAQ
        safeAreaInsets={{ top: 20, left: 0, right: 0, bottom: 0 }}
        // @ts-ignore STRICTNESS_MIGRATION
        artworkAttributionClasses={attributionClasses}
      />
    )

    expect(tree.UNSAFE_getAllByType(Text)).toHaveLength(17)
    expect(tree.getByText("Unique")).toBeTruthy()
    expect(tree.getByText("One of a kind piece, created by the artist.")).toBeTruthy()
  })

  it("returns to previous page when ok button is clicked", () => {
    const tree = renderWithWrappers2(
      <ArtworkAttributionClassFAQ
        safeAreaInsets={{ top: 20, left: 0, right: 0, bottom: 0 }}
        // @ts-ignore STRICTNESS_MIGRATION
        artworkAttributionClasses={attributionClasses}
      />
    )

    fireEvent.press(tree.getByTestId("okButton"))

    expect(SwitchBoard.dismissNavigationViewController).toHaveBeenCalled()
  })
})

const attributionClasses = [
  {
    name: "Unique",
    longDescription: "One of a kind piece, created by the artist.",
    " $refType": null,
  },
  {
    name: "Limited edition",
    longDescription:
      "Original works created in multiple with direct involvement of the artist. Generally, less than 150 pieces total.",
    " $refType": null,
  },
  {
    name: "Made-to-order",
    longDescription: "A piece that is made-to-order, taking into account the collector’s preferences.",
    " $refType": null,
  },
  {
    name: "Reproduction",
    longDescription:
      "Reproduction of an original work authorized by artist’s studio or estate. The artist was not directly involved in production.",
    " $refType": null,
  },
  {
    name: "Editioned multiple",
    longDescription:
      "Pieces created in larger limited editions, authorized by the artist’s studio or estate. Not produced with direct involvement of the artist.",
    " $refType": null,
  },
  {
    name: "Non-editioned multiple",
    longDescription:
      "Works made in unlimited or unknown numbers of copies, authorized by the artist’s studio or estate. Not produced with direct involvement of the artist.",
    " $refType": null,
  },
  {
    name: "Ephemera",
    longDescription:
      "Items related to the artist, created or manufactured for a specific, limited use. This includes exhibition materials, memorabilia, autographs, etc.",
    " $refType": null,
  },
]
