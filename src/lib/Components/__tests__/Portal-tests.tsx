import React from "react"
import { Text, View } from "react-native"

import { renderWithWrappers } from "lib/tests/renderWithWrappers"

import { Portal, PortalProvider } from "../Portal"

describe("Portal", () => {
  it("Renders children as children of PortalProvider", () => {
    const tree = renderWithWrappers(
      <PortalProvider>
        <View>
          <Text>Foo Bar</Text>
          <Portal>
            <Text>Bar Baz</Text>
          </Portal>
        </View>
      </PortalProvider>
    ).root

    expect(tree.findAllByType(Text)[1].props.children).toMatch("Bar Baz")
  })
})
