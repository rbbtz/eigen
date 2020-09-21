import { CollectionHeaderTestsQueryRawResponse } from "__generated__/CollectionHeaderTestsQuery.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { ReadMore } from "lib/Components/ReadMore"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Text } from "react-native"
import { graphql } from "react-relay"
import { CollectionFixture } from "../../Components/__fixtures__/CollectionFixture"
import { CollectionHeader, CollectionHeaderContainer } from "../CollectionHeader"

jest.unmock("react-relay")

xit("renders without throwing an error", async () => {
  await renderRelayTree({
    Component: (props: any) => <CollectionHeaderContainer collection={props.marketingCollection} {...props} />,
    query: graphql`
      query CollectionHeaderTestsQuery @raw_response_type {
        marketingCollection(slug: "street-art-now") {
          ...CollectionHeader_collection
        }
      }
    `,
    mockData: { marketingCollection: CollectionFixture } as CollectionHeaderTestsQueryRawResponse,
  })
})

describe("collection header", () => {
  // @ts-ignore STRICTNESS_MIGRATION
  let props: any
  beforeEach(() => {
    props = {
      collection: { ...CollectionFixture },
    }
  })

  it("passes the collection header image url to collection header", () => {
    const tree = renderWithWrappers(<CollectionHeader {...props} />).root

    expect(tree.findAllByType(OpaqueImageView)[0].props.imageURL).toBe("http://imageuploadedbymarketingteam.jpg")
  })

  it("passes the collection header title to collection header", () => {
    const tree = renderWithWrappers(<CollectionHeader {...props} />).root

    expect(tree.findAllByType(Text)[0].props.children).toBe("Street Art Now")
  })

  it("passes the url of the most marketable artwork in the collection to the collection header when there is no headerImage value present", () => {
    props.collection.headerImage = null
    const tree = renderWithWrappers(<CollectionHeader {...props} />).root

    expect(tree.findAllByType(OpaqueImageView)[0].props.imageURL).toBe(
      "https://defaultmostmarketableartworkincollectionimage.jpg"
    )
  })

  it("does not render the Read More component when there is no description", () => {
    props.collection.descriptionMarkdown = null
    const tree = renderWithWrappers(<CollectionHeader {...props} />).root

    expect(tree.findAllByType(ReadMore)).toHaveLength(0)
  })

  it("passes the collection header description to collection header", () => {
    const tree = renderWithWrappers(<CollectionHeader {...props} />).root

    expect(tree.findAllByType(ReadMore)).toHaveLength(1) // doest work?
    expect(tree.findAllByType(Text)[1].props.children.join("")).toBe(
      "A beach towel by Yayoi Kusama, a classic print by Alexander Calder, or a piggy bank by Yoshitomo Nara"
    ) // maybe .join("") is not the best way?
  })
})
