import FeedbackItem from "./FeedbackItem"
import Spinner from "../Spinner"
import ErrorMessage from "../ErrorMessage"
import { FeedbackItemType } from "../../lib/types"

type FeedbackListProps = {
  isLoading: boolean,
  errorMsg: string,
  feedbackItems: FeedbackItemType[]
}

export default function FeedbackList({ isLoading, errorMsg, feedbackItems }: FeedbackListProps) {
  return (
    < ol className="feedback-list" >
      {isLoading && <Spinner />}
      {errorMsg && <ErrorMessage message={errorMsg} />}
      {feedbackItems.map(item => (<FeedbackItem key={item.id} feedbackItem={item} />))}
    </ol >
  )
}
