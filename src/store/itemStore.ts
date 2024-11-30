import { ItemResponse } from "@/types/item";
import axiosInstance from "@/utils/axiosInstance";
import { create } from "zustand";

interface ItemStore {
  items?: ItemResponse;
  fetchItem: (limit?: number, keyword?: string, page?: number) => Promise<void>;
}

const itemStore = create<ItemStore>((set) => ({
  fetchItem: async (limit?: number, keyword?: string, page?: number) => {
    try {
      const response = await axiosInstance.get<ItemResponse>(
        `/items?${limit ? "limit=" + limit : ""}${
          keyword ? "&keyword=" + keyword : ""
        }${page ? "&page=" + page : ""}`
      );
      set({ items: response.data });
    } catch (err: any) {}
  },
}));

export default itemStore;
