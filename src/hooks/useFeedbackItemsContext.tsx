import { useContext } from "react"
import { FeedbackItemsContext } from "../contexts/FeedbackItemsContextProvider"

export default function useFeedbackItemsContext() {
  const context = useContext(FeedbackItemsContext)

  if (!context) {
    throw new Error("no context")
  }

  return context;
}
