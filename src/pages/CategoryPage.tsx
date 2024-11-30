import { category_columns } from "@/components/category/CategoryColumns";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast, useToast } from "@/hooks/use-toast";
import categoryStore from "@/store/categoryStore";
import { CategoryResponse } from "@/types/category";
import axiosInstance from "@/utils/axiosInstance";
import getPaginationRange from "@/utils/getPaginationRange";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { data, useNavigate } from "react-router-dom";
interface FormValues {
  name: string;
}

const CategoryPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState<number | undefined>();
  const [keyword, setKeyword] = useState("");
  const { categories, loading, fetchCategory } = categoryStore();

  const [formData, setFormData] = useState<FormValues>({
    name: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [errorName, setErrorName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchCategory(limit, keyword, page);
  }, [fetchCategory]);

  const pagination = useMemo(() => {
    return getPaginationRange(
      categories?.data.pagination.current_page,
      categories?.data.pagination.last_page
    );
  }, [
    categories?.data.pagination.current_page,
    categories?.data.pagination.last_page,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //   Create
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      const url = import.meta.env.VITE_BACKEND_PORT;
      const name = formData.name;
      const response = await axiosInstance.post<CategoryResponse>(
        `${url}categories/create`,
        {
          name,
        }
      );

      if (response.data.status == 200) {
        fetchCategory(limit, keyword);
        setSubmitted(false);
        setOpen(false);
        setFormData({
          name: "",
        });
        navigate("/categories");
      } else {
        if (response.data.validate_error_message.name) {
          setErrorName(response.data.validate_error_message.name[0]);
        }
        if (response.data.message) {
          setErrorMessage(response.data.message);
        }
      }
    } catch (error) {
      setErrorMessage("Something went wrong!");
    }
  };

  //   Delete
  const handleDelete = async (id: string) => {
    try {
      const url = import.meta.env.VITE_BACKEND_PORT;
      const response = await axiosInstance.delete<CategoryResponse>(
        `${url}categories/delete/${id}`
      );

      if (response.data.success == true) {
        fetchCategory(limit);
        toast({
          title: "Delete Category",
          description: "Category deleted successfully!",
        });
      }
    } catch (error) {
      return null;
    }
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>DETL - Category</title>
      </Helmet>
      <div>
        <div className="flex justify-between items-center">
          <Breadcrumb page="Category" action="List" />
          <Button
            onClick={() => setOpen(true)}
            className="bg-black text-white py-2 px-4 rounded"
          >
            Add Category
          </Button>
          <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Category</DialogTitle>
                <DialogDescription>
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col space-y-3"
                  >
                    <div>
                      <Label
                        htmlFor="name"
                        className={errorName ? "text-red-500" : ""}
                      >
                        Name
                      </Label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={errorName ? "border-red-500" : ""}
                      />
                      {errorName ? (
                        <p className="text-red-500 text-sm">{errorName}</p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div>
                      <Button
                        type="submit"
                        disabled={submitted}
                        className="w-full flex"
                      >
                        Save
                      </Button>
                    </div>
                  </form>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <div className="flex justify-end py-2">
            <Input
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // Do code here
                  e.preventDefault();

                  fetchCategory(limit, keyword);
                }
              }}
              placeholder="Search...."
              className="max-w-sm"
            />
          </div>
          <hr />
          <div>
            {/* Table */}

            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      No
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Created Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.data.categories.map((category, index) => {
                    return (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {index + 1}
                        </th>
                        <td className="px-6 py-4">{category.name}</td>
                        <td className="px-6 py-4">{category.created_at}</td>
                        <td className="px-6 py-4">
                          <Button className="bg-white hover:bg-white text-green-500 shadow-none">
                            Edit
                          </Button>
                          |{" "}
                          <Button
                            onClick={() => handleDelete(category.id)}
                            className="bg-white hover:bg-white text-red-500 shadow-none"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <nav
              aria-label="Page navigation example"
              className="mt-4 flex justify-end"
            >
              <ul className="flex items-center -space-x-px h-8 text-sm">
                <li>
                  <button
                    onClick={() => {
                      fetchCategory(
                        limit,
                        keyword,
                        categories!.data.pagination.current_page > 1
                          ? categories!.data.pagination.current_page - 1
                          : categories!.data.pagination.current_page
                      );
                      setPage(
                        categories!.data.pagination.current_page > 1
                          ? categories!.data.pagination.current_page - 1
                          : categories!.data.pagination.current_page
                      );
                    }}
                    className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="w-2.5 h-2.5 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 1 1 5l4 4"
                      />
                    </svg>
                  </button>
                </li>
                {pagination.map((page, index) => {
                  if (page > 0)
                    return (
                      <li key={index}>
                        <button
                          onClick={() => {
                            fetchCategory(limit, keyword, page);
                            setPage(page);
                          }}
                          className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          {page}
                        </button>
                      </li>
                    );
                  else
                    return (
                      <li
                        key={index}
                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        ...
                      </li>
                    );
                })}

                <li>
                  <button
                    onClick={() => {
                      fetchCategory(
                        limit,
                        keyword,
                        categories!.data.pagination.current_page <
                          categories!.data.pagination.total
                          ? categories!.data.pagination.current_page + 1
                          : undefined
                      );
                      setPage(
                        categories!.data.pagination.current_page <
                          categories!.data.pagination.total
                          ? categories!.data.pagination.current_page + 1
                          : undefined
                      );
                    }}
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="w-2.5 h-2.5 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
