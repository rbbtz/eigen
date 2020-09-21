import React from "react"
import { Text, TouchableWithoutFeedback } from "react-native"

import { renderWithWrappers } from "lib/tests/renderWithWrappers"

import { act } from "react-test-renderer"
import { CommercialEditionSetInformation } from "../CommercialEditionSetInformation"

const artwork = {
  editionSets: [
    {
      id: "RWRpdGlvblNldDo1YmJiOTc3N2NlMmZjMzAwMmMxNzkwMTM=",
      internalID: "5bbb9777ce2fc3002c179013",
      isAcquireable: true,
      isOfferable: true,
      saleMessage: "$1",
      edition_of: "",
      dimensions: {
        in: "2 × 2 in",
        cm: "5.1 × 5.1 cm",
      },
    },
    {
      id: "RWRpdGlvblNldDo1YmMwZWMwMDdlNjQzMDBhMzliMjNkYTQ=",
      internalID: "5bc0ec007e64300a39b23da4",
      isAcquireable: true,
      isOfferable: true,
      saleMessage: "$2",
      edition_of: "",
      dimensions: {
        in: "1 × 1 in",
        cm: "2.5 × 2.5 cm",
      },
    },
  ],
}

describe("CommercialEditionSetInformation", () => {
  it("changes displays first edition price", () => {
    const tree = renderWithWrappers(
      <CommercialEditionSetInformation setEditionSetId={() => null} artwork={artwork as any} />
    ).root

    expect(tree.findAllByType(Text)[3].props.children).toMatch("$1")
  })

  it("changes display price to selected edition set", () => {
    const tree = renderWithWrappers(
      <CommercialEditionSetInformation setEditionSetId={() => null} artwork={artwork as any} />
    ).root

    act(() => tree.findAllByType(TouchableWithoutFeedback)[1].props.onPress())
    expect(tree.findAllByType(Text)[3].props.children).toMatch("$2")
  })
})
