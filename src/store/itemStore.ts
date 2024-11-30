import { ItemResponse } from "@/types/item";
import axiosInstance from "@/utils/axiosInstance";
import { create } from "zustand";

interface ItemStore {
  items?: ItemResponse;
  fetchItem: (
    limit?: number,
    keyword?: string,
    page?: number,
    category_id?: string
  ) => Promise<void>;
}

const itemStore = create<ItemStore>((set) => ({
  fetchItem: async (
    limit?: number,
    keyword?: string,
    page?: number,
    category_id?: string
  ) => {
    try {
      const response = await axiosInstance.get<ItemResponse>(
        `/items?${limit ? "limit=" + limit : ""}${
          keyword ? "&keyword=" + keyword : ""
        }${page ? "&page=" + page : ""}${
          category_id ? "&category_id=" + category_id : ""
        }`
      );
      set({ items: response.data });
    } catch (err: any) {}
  },
}));

export default itemStore;
