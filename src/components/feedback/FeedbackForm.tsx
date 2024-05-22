import { useState } from "react"
import { MAX_CHARS } from "../../lib/const"

type FeedbackFormProps = {
  onAddToList: (text: string) => void;
}

export default function FeedbackForm({ onAddToList }: FeedbackFormProps) {
  const [text, setText] = useState("")
  const [showValidIndicator, setShowValidIndicator] = useState(false)
  const [showInvalidIndicator, setShowInvalidIndicator] = useState(false)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setShowValidIndicator(false)
    setShowInvalidIndicator(false)
    setText(e.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // basic validation
    if (text.includes("#")) {
      setShowValidIndicator(true)
    } else {
      setShowInvalidIndicator(true)
      return
    }
    onAddToList(text)
    setText("")
  }

  const textRemain = MAX_CHARS - text.length
  return (
    <form className={`form ${showValidIndicator ? "form--valid" : ""} ${showInvalidIndicator ? "form--invalid" : ""}`} onSubmit={handleSubmit}>
      <textarea value={text} onChange={handleTextChange} id="feedback-textarea" placeholder="" spellCheck={false} maxLength={MAX_CHARS} />
      <label htmlFor="feedback-textarea">
        Enter your feedback here, remember to #hashtag the company
      </label>
      <div>
        <p className="u-italic">{textRemain}</p>
        <button type="submit"><span>Submit</span></button>
      </div>
    </form>
  )
}
