import { Markdown } from "lib/Components/Markdown"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Text, TouchableWithoutFeedback } from "react-native"
import { act } from "react-test-renderer"
import { HoursCollapsible } from "../HoursCollapsible"

describe("HoursCollapsible", () => {
  const hours = {
    text: "Monday: Foo - Bar\nTuesday: Bar - Baz\nWednesday - Friday: Closed",
  }

  it("renders properly", () => {
    const tree = renderWithWrappers(<HoursCollapsible openingHours={hours} />).root

    expect(tree.findAllByType(Text)[0].props.children).toMatch("Opening hours")
  })

  it("expands when pressed", () => {
    const tree = renderWithWrappers(<HoursCollapsible openingHours={hours} />).root

    act(() => tree.findAllByType(TouchableWithoutFeedback)[0].props.onPress())

    expect(tree.findAllByType(Text)[1].props.children.join("")).toMatch(hours.text)
  })

  it("renders markdown", () => {
    const markdownHours = {
      text: "**Collectors Preview**\r\nNovember 8 Thursday 14:00 to 20:00\r\n [November 9th](http://foo.bar)",
    }

    const tree = renderWithWrappers(<HoursCollapsible openingHours={markdownHours} />).root

    act(() => tree.findAllByType(TouchableWithoutFeedback)[0].props.onPress())

    expect(tree.findAllByType(Markdown).length).toEqual(1)
  })
})
