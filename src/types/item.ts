import { Category } from "./category";
import { Pagination } from "./pagination";

export interface ItemResponse {
  success: boolean;
  data: ItemList;
  message: string;
  validate_error_message: Message;
  status: number;
}

export interface ItemList {
  items: Item[];
  pagination: Pagination;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: Category;
  created_at: string;
}

export interface Message {
  title: string[];
  description: string[];
  category_id: string[];
}
