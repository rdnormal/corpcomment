import { FeedbackItemType } from "../../lib/types";
import FeedbackList from "../feedback/FeedbackList";
import Header from "./Header";

type ContainerProps = {
  isLoading: boolean,
  feedbackItems: FeedbackItemType[],
  errorMsg: string,
  handleAddToList: (text: string) => void
}

export default function Container({ isLoading, errorMsg, handleAddToList, feedbackItems }: ContainerProps) {
  return (
    <main className="container">
      <Header handleAddToList={handleAddToList} />
      <FeedbackList isLoading={isLoading} errorMsg={errorMsg} feedbackItems={feedbackItems} />
    </main>
  )
}
