import { CategoryResponse } from "@/types/category";
import axiosInstance from "@/utils/axiosInstance";
import { create } from "zustand";

interface CategoryStore {
  categories?: CategoryResponse;
  fetchCategory: (
    limit?: number,
    keyword?: string,
    page?: number
  ) => Promise<void>;
}

const categoryStore = create<CategoryStore>((set) => ({
  fetchCategory: async (limit?: number, keyword?: string, page?: number) => {
    try {
      const response = await axiosInstance.get<CategoryResponse>(
        `/categories?${limit ? "limit=" + limit : ""}${
          keyword ? "&keyword=" + keyword : ""
        }${page ? "&page=" + page : ""}`
      );
      set({ categories: response.data, loading: false });
    } catch (err: any) {}
  },
}));

export default categoryStore;
