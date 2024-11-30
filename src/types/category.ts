import { Pagination } from "./pagination";

export interface CategoryResponse {
  success: boolean;
  data: CategoryList;
  message: string;
  validate_error_message: Message;
  status: number;
}

export interface CategoryList {
  categories: Category[];
  pagination: Pagination;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Message {
  name: string[];
  email: string[];
  password: string[];
}
