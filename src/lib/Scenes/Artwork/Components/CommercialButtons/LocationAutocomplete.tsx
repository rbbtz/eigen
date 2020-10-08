import { Input } from "lib/Components/Input/Input"
import { Flex, Text, Touchable } from "palette"
import { stringify } from "qs"
import React, { useState } from "react"
import Config from "react-native-config"

interface Props {
  onChange: any
}

interface Location {
  id: string
  name: string
}

/** Expected GMaps API prediction shape */
interface LocationPrediction {
  place_id: string
  description: string
}

// maybe this is overkill, or maybe it would be nice to move so we can mock it out
class GmapsApi {
  static async queryLocation(query: string): Promise<Location[]> {
    const apiKey = Config.GOOGLE_MAPS_API_KEY
    const queryString = stringify({
      key: apiKey,
      language: "en",
      types: "(cities)",
      input: query,
    })

    const response = await fetch("https://maps.googleapis.com/maps/api/place/autocomplete/json?" + queryString)
    const results = await response.json()
    return results.predictions.map(this.predictionToResult)
  }

  private static predictionToResult(prediction: LocationPrediction): Location {
    return { id: prediction.place_id, name: prediction.description }
  }
}

export const LocationAutocomplete: React.FC<Props> = ({ onChange, ...props }) => {
  const [predictions, setPredictions] = useState<Location[]>([])

  const inputChange = async (str: string): Promise<void> => {
    if (str.length < 3) {
      setPredictions([])
    } else {
      const googlePredictions = await GmapsApi.queryLocation(str)
      setPredictions(googlePredictions)
      onChange(str)
    }
  }

  return (
    <>
      <Text>Location</Text>
      <Input placeholder="Add Location" style={{ marginVertical: 10 }} onChangeText={inputChange} />
      <Text color="black60">
        Sharing your location with galleries helps them provide fast and accurate shipping quotes. You can always edit
        this information later in your Collector Profile.
      </Text>
      <LocationPredictions predictions={predictions} />
    </>
  )
}

const LocationPredictions = ({ predictions }: { predictions: Location[] }) => {
  if (predictions.length === 0) {
    return null
  }
  return (
    <Flex>
      {predictions.map((p) => (
        <Touchable
          key={p.id}
          onPress={() => {
            console.warn(`selected ${p.name}...`)
          }}
        >
          <Text>{p.name}</Text>
        </Touchable>
      ))}
      <Text>👁 Brought to you by google 👁</Text>
    </Flex>
  )
}
