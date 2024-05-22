import { useEffect, useMemo, useState } from "react"
import Container from "./components/layout/Container"
import Footer from "./components/layout/Footer"
import HashtagList from "./components/hashtag/HashtagList"
import { FeedbackItemType } from "./lib/types"

function App() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItemType[]>([])
  const [isLoading, setIsloading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [selectedCompany, setSelectedCompany] = useState<string>("")

  const filteredFeedbackItems = useMemo(() => selectedCompany ? feedbackItems.filter(item => item.company === selectedCompany) : feedbackItems, [feedbackItems, selectedCompany])

  const companyList = useMemo(() => feedbackItems.map(item => item.company).filter((company, index, array) => {
    return array.indexOf(company) === index
  }), [feedbackItems]) 

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

  const handleSelectedCompany = (company: string) => {
    setSelectedCompany(company)
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  return (
    <div className="app">
      <Footer />
      <Container isLoading={isLoading} errorMsg={errorMsg} handleAddToList={handleAddToList} feedbackItems={filteredFeedbackItems} />
      <HashtagList companyList={companyList} handleSelectedCompany={handleSelectedCompany}/>
    </div>
  )
}

export default App
