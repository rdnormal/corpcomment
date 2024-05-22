import { useFeedbackItemsStore } from "../../store/feedbackItemsStore"
import HashtagItem from "./HashtagItem"

export default function HashtagList() {
  const companyList = useFeedbackItemsStore(state => state.getCompanyList());
  const selectedCompany = useFeedbackItemsStore(state => state.selecteComapny);

  return (
    <ul className="hashtags">
      {
        companyList.map(company => (<HashtagItem key={company} company={company} onSelectCompany={selectedCompany} />))
      }
    </ul>
  )
}
