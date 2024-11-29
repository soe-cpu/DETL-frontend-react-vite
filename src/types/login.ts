export interface LoginResponse {
  success: boolean;
  token: string;
  message: string;
  validate_error_message: Message;
  data: User;
  status: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  email: string[];
  password: string[];
}
