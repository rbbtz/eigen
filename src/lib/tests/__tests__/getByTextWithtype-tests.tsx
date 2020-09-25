import { render } from "@testing-library/react-native"
import { Button } from "palette"
import React from "react"
import { Text, View } from "react-native"
import { getByTextWithType } from "../getByTextWithType"

const Component = () => {
  return (
    <View>
      <Button testID="b1">wow</Button>
      <Button testID="b2">amazing</Button>
      <Button testID="b3">unique button</Button>
      <Text testID="t1">wow</Text>
      <Text testID="t2">amazing</Text>
      <Text testID="t3">also unique but text</Text>
    </View>
  )
}

describe(getByTextWithType, () => {
  it("works", () => {
    const tree = render(<Component />)

    expect(tree.getAllByText("wow")).toHaveLength(2)
    expect(tree.getAllByText("amazing")).toHaveLength(2)
    expect(tree.getAllByText("unique button")).toHaveLength(1)

    const bWow = tree.getByTestId("b1")

    expect(getByTextWithType("wow", Button)).toBe(bWow)
  })
})
