import { InquiryButtons_artwork } from "__generated__/InquiryButtons_artwork.graphql"
import { ArtworkInquiryContext, InquiryTypes } from "lib/utils/ArtworkInquiry/ArtworkInquiryStore"
import { Button, ButtonVariant } from "palette"
import React, { useContext, useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { InquiryModalFragmentContainer } from "./InquiryModal"

export interface InquiryButtonsProps {
  artwork: InquiryButtons_artwork
  // EditionSetID is passed down from the edition selected by the user
  editionSetID?: string
  variant?: ButtonVariant
}

export interface InquiryButtonsState {
  modalIsVisible: boolean
}

export const InquiryButtons: React.FC<InquiryButtonsProps> = ({ artwork, ...props }) => {
  const [modalVisibility, setModalVisibility] = useState(false)
  const { dispatch } = useContext(ArtworkInquiryContext)

  const dispatchAction = (buttonText: string) => {
    dispatch({
      type: "selectInquiryType",
      payload: buttonText as InquiryTypes,
    })

    setModalVisibility(true)
  }

  return (
    <>
      {!!artwork.isPriceHidden && (
        <Button
          onPress={() => dispatchAction("Request Price")}
          size="large"
          mb={1}
          block
          width={100}
          variant={props.variant}
        >
          Request Price
        </Button>
      )}
      {!artwork.isPriceHidden && (
        <Button
          onPress={() => dispatchAction("Inquire to Purchase")}
          size="large"
          mb={1}
          block
          width={100}
          variant={props.variant}
        >
          Inquire to Purchase
        </Button>
      )}
      <Button
        onPress={() => dispatchAction("Contact Gallery")}
        size="large"
        block
        width={100}
        variant="secondaryOutline"
      >
        Contact Gallery
      </Button>
      <InquiryModalFragmentContainer
        artwork={artwork}
        modalIsVisible={modalVisibility}
        toggleVisibility={() => setModalVisibility(!modalVisibility)}
      />
    </>
  )
}

export const InquiryButtonsFragmentContainer = createFragmentContainer(InquiryButtons, {
  artwork: graphql`
    fragment InquiryButtons_artwork on Artwork {
      image {
        url
        width
        height
      }
      internalID
      isPriceHidden
      title
      date
      medium
      dimensions {
        in
        cm
      }
      editionOf
      signatureInfo {
        details
      }
      artist {
        name
      }
      ...InquiryModal_artwork
    }
  `,
})
