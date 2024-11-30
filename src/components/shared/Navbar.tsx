import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import getUserFromLocalStorage from "@/utils/getUserFromLocalStorage";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = getUserFromLocalStorage("user");
  const navigate = useNavigate();

  const signOut = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    navigate("/sign-in");
  };

  return (
    <div className="fixed top-0 z-50 w-full border-b  bg-white shadow-sm  ">
      <div className="px-3 py-3 lg:px-8 lg:pl-3">
        <div className="flex items-center justify-between ">
          <div>
            <a className="no-underline text-2xl font-semibold">Dashboard</a>
          </div>
          <div>
            <div className="hidden sm:flex sm:items-center sm:ms-6">
              <div className="ms-3 relative">
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <span className="inline-flex rounded-md">
                      <div className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150">
                        {user ? user.name : ""}
                        <svg
                          className="ms-2 -me-0.5 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <div>
                      <div className="px-4 py-2">
                        <p>{user?.name}</p>
                        <p>{user?.email}</p>
                      </div>
                      <hr />
                      <Button
                        onClick={signOut}
                        className="bg-white border-0 text-red-500 shadow-none hover:bg-white"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
