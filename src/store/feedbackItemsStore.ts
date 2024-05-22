import { create } from "zustand";
import { FeedbackItemType } from "../lib/types";

type Store = {
  feedbackItems: FeedbackItemType[];
  isLoading: boolean;
  errorMsg: string;
  selectedCompany: string;
  getCompanyList: () => string[];
  getFilteredFeedbackItems: () => FeedbackItemType[];
  addItemToList: (text: string) => Promise<void>;
  selecteComapny: (company: string) => void;
  fetchFeedbackItems: () => Promise<void>;
};

export const useFeedbackItemsStore = create<Store>((set, get) => ({
  feedbackItems: [],
  isLoading: false,
  errorMsg: "",
  selectedCompany: "",
  addItemToList: async (text: string) => {
    const companyName = text
      .split(" ")
      .find((word) => word.includes("#"))!
      .substring(1);
    const newItem: FeedbackItemType = {
      id: new Date().getTime(),
      text: text,
      upvoteCount: 0,
      daysAgo: 0,
      company: companyName,
      badgeLetter: companyName?.substring(0, 1).toUpperCase(),
    };

    set((state) => ({
      feedbackItems: [...state.feedbackItems, newItem],
    }));

    await fetch(
      "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks",
      {
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  },
  selecteComapny: (company: string) => {
    set(() => ({ selectedCompany: company }));
  },
  fetchFeedbackItems: async () => {
    try {
      set(() => ({ isLoading: true }));
      const res = await fetch(
        "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      set(() => ({
        feedbackItems: data.feedbacks,
      }));
    } catch (err) {
      set(() => ({ errorMsg: "Something went wrong, please try again later" }));
    }
    set(() => ({ isLoading: false }));
  },
  getCompanyList: () => {
    return get()
      .feedbackItems.map((item) => item.company)
      .filter((company, index, array) => {
        return array.indexOf(company) === index;
      });
  },
  getFilteredFeedbackItems: () => {
    const state = get();
    return state.selectedCompany
      ? state.feedbackItems.filter(
          (item) => item.company === state.selectedCompany
        )
      : state.feedbackItems;
  },
}));
