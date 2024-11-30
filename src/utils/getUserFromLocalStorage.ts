import { User } from "@/types/login";

const getUserFromLocalStorage = (key: string): User | null => {
  const storedItem = localStorage.getItem(key);

  if (storedItem) {
    return JSON.parse(storedItem); // Type casting for the returned value
  }
  return null;
};
export default getUserFromLocalStorage;
