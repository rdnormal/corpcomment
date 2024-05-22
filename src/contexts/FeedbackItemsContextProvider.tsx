import { createContext, useEffect, useMemo, useState } from "react"
import { FeedbackItemType } from "../lib/types"

type contextValueType = {
  isLoading: boolean,
  errorMsg: string,
  companyList: string[],
  filteredFeedbackItems: FeedbackItemType[],
  handleAddToList: (text: string) => void,
  handleSelectedCompany: (company: string) => void
}

export const FeedbackItemsContext = createContext<null | contextValueType>(null);

export default function FeedbackItemsContextProvider({ children }: { children: React.ReactNode }) {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItemType[]>([])
  const [isLoading, setIsloading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [selectedCompany, setSelectedCompany] = useState<string>("")

  const companyList = useMemo(() => feedbackItems.map(item => item.company).filter((company, index, array) => {
    return array.indexOf(company) === index
  }), [feedbackItems])

  const filteredFeedbackItems = useMemo(() => selectedCompany ? feedbackItems.filter(item => item.company === selectedCompany) : feedbackItems, [feedbackItems, selectedCompany])

  const fetchFeedbacks = async () => {
    try {
      setIsloading(true)
      const res = await fetch("https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks")
      if (!res.ok) throw new Error();
      const data = await res.json()
      setFeedbackItems(data.feedbacks)
    } catch (err) {
      setErrorMsg("Something went wrong, please try again later")
    }
    setIsloading(false)
  }

  const handleSelectedCompany = (company: string) => {
    setSelectedCompany(company)
  }

  const handleAddToList = async (text: string) => {
    const companyName = text.split(' ').find(word => word.includes("#"))!.substring(1);
    const newItem: FeedbackItemType = {
      id: new Date().getTime(),
      text: text,
      upvoteCount: 0,
      daysAgo: 0,
      company: companyName,
      badgeLetter: companyName?.substring(0, 1).toUpperCase()
    };
    setFeedbackItems([...feedbackItems, newItem])

    await fetch("https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks", {
      method: "POST", body: JSON.stringify(newItem), headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const contextValue = {
    isLoading,
    errorMsg,
    companyList,
    filteredFeedbackItems,
    handleAddToList,
    handleSelectedCompany
  }

  return (
    <FeedbackItemsContext.Provider value={contextValue}>{children}</FeedbackItemsContext.Provider>
  )
}
