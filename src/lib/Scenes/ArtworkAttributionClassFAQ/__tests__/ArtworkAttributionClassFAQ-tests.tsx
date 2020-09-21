import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button, Sans } from "palette"
import React from "react"
import { ArtworkAttributionClassFAQ } from "../ArtworkAttributionClassFAQ"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  dismissNavigationViewController: jest.fn(),
}))

import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { act } from "react-test-renderer"

describe("ArtworkAttributionClassFAQ", () => {
  it("renders FAQ header", () => {
    const tree = renderWithWrappers(
      <ArtworkAttributionClassFAQ
        safeAreaInsets={{ top: 20, left: 0, right: 0, bottom: 0 }}
        // @ts-ignore STRICTNESS_MIGRATION
        artworkAttributionClasses={attributionClasses}
      />
    ).root

    expect(tree.findAllByType(Sans)[0].props.children).toMatch("Artwork classifications")
  })

  it("renders Ok button", () => {
    const tree = renderWithWrappers(
      <ArtworkAttributionClassFAQ
        safeAreaInsets={{ top: 20, left: 0, right: 0, bottom: 0 }}
        // @ts-ignore STRICTNESS_MIGRATION
        artworkAttributionClasses={attributionClasses}
      />
    ).root

    expect(tree.findAllByType(Button)[0].props.children).toMatch("OK")
  })

  it("renders attribution classes", () => {
    const tree = renderWithWrappers(
      <ArtworkAttributionClassFAQ
        safeAreaInsets={{ top: 20, left: 0, right: 0, bottom: 0 }}
        // @ts-ignore STRICTNESS_MIGRATION
        artworkAttributionClasses={attributionClasses}
      />
    ).root

    expect(tree.findAllByType(Sans)).toHaveLength(17)
    expect(tree.findAllByType(Sans)[1].props.children).toMatch("Unique")
    expect(tree.findAllByType(Sans)[2].props.children).toMatch("One of a kind piece, created by the artist.")
  })

  it("returns to previous page when ok button is clicked", () => {
    const tree = renderWithWrappers(
      <ArtworkAttributionClassFAQ
        safeAreaInsets={{ top: 20, left: 0, right: 0, bottom: 0 }}
        // @ts-ignore STRICTNESS_MIGRATION
        artworkAttributionClasses={attributionClasses}
      />
    ).root

    act(() => {
      const okButton = tree.findAllByType(Button)[0]
      okButton.props.onPress()
    })
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
