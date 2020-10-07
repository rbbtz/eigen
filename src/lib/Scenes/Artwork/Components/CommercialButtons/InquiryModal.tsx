import { InquiryModal_artwork } from "__generated__/InquiryModal_artwork.graphql"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Text } from "palette"
import React, { useEffect, useState } from "react"
import NavigatorIOS from "react-native-navigator-ios"
import { createFragmentContainer, graphql } from "react-relay"
import { CollapsibleArtworkDetailsFragmentContainer } from "./CollapsibleArtworkDetails"

import { Button, ButtonVariant } from "palette"
import {ShippingModal} from "./ShippingModal"

interface InquiryModalProps {
  artwork: InquiryModal_artwork
  closeModal?: () => void
  exitModal?: () => void
  toggleVisibility: () => void
  navigator?: NavigatorIOS
  modalIsVisible: boolean
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ artwork, ...props }) => {
  const { toggleVisibility, modalIsVisible } = props
  const [ shippingModalVisibility, setShippingModalVisibility ] = useState(false)
  const [ location, setLocation ] = useState<any>(null)

  return (
    <FancyModal visible={modalIsVisible} onBackgroundPressed={() => toggleVisibility()}>
      <FancyModalHeader leftButtonText="Cancel" onLeftButtonPress={() => toggleVisibility()}>
        Contact Gallery
      </FancyModalHeader>
      {/*<CollapsibleArtworkDetailsFragmentContainer artwork={artwork} />*/}
      <Text m={2} variant="title">
        More here
      </Text>
      <Button onPress={() => setShippingModalVisibility(true)} size="large" block width={100} variant="secondaryOutline">
        Open Shipping Modal
      </Button>
      <ShippingModal
        toggleVisibility={() => setShippingModalVisibility(!shippingModalVisibility)}
        modalIsVisible={shippingModalVisibility}
        setLocation={setLocation}
      />
    </FancyModal>
  )
}

export const InquiryModalFragmentContainer = createFragmentContainer(InquiryModal, {
  artwork: graphql`
    fragment InquiryModal_artwork on Artwork {
      ...CollapsibleArtworkDetails_artwork
    }
  `,
})
