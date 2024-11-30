import { ItemResponse } from "@/types/item";
import axiosInstance from "@/utils/axiosInstance";
import { create } from "zustand";

interface ItemStore {
  items?: ItemResponse;
  fetchItem: (limit?: number, keyword?: string) => Promise<void>;
}

const itemStore = create<ItemStore>((set) => ({
  fetchItem: async (limit?: number, keyword?: string) => {
    try {
      const response = await axiosInstance.get<ItemResponse>(
        `/items?${limit ? "limit=" + limit : ""}${
          keyword ? "&keyword=" + keyword : ""
        }`
      );
      set({ items: response.data, loading: false });
    } catch (err: any) {}
  },
}));

export default itemStore;
