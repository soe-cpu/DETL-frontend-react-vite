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
import { useToast } from "@/hooks/use-toast";
import categoryStore from "@/store/categoryStore";
import itemStore from "@/store/itemStore";
import { Item, ItemResponse } from "@/types/item";
import axiosInstance from "@/utils/axiosInstance";
import getPaginationRange from "@/utils/getPaginationRange";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import moment from "moment";
interface FormValues {
  title: string;
  description: string;
}

const ItemPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState<number | undefined>();
  const [keyword, setKeyword] = useState("");
  const [editItem, setEditItem] = useState<Item>();
  const [errorMessage, setErrorMessage] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const [errorDesc, setErrorDesc] = useState("");
  const [errorCategory, setErrorCategory] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormValues>({
    title: "",
    description: "",
  });

  //  Fetch
  const { items, fetchItem } = itemStore();
  const { categories, fetchCategory } = categoryStore();

  useEffect(() => {
    fetchCategory(100);
    fetchItem(limit, keyword, page);
  }, [fetchItem, fetchCategory]);

  const pagination = useMemo(() => {
    return getPaginationRange(
      items?.data.pagination.current_page,
      items?.data.pagination.last_page
    );
  }, [items?.data.pagination.current_page, items?.data.pagination.last_page]);

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
      const title = formData.title;
      const description = formData.description;
      const category_id = categoryId;
      const response = await axiosInstance.post<ItemResponse>(
        `${url}items/create`,
        {
          title,
          description,
          category_id,
        }
      );

      if (response.data.status == 200) {
        toast({
          title: "Item Create",
          description: "Item created successfully!",
        });
        setFormData({
          title: "",
          description: "",
        });

        fetchItem(limit, keyword);

        setSubmitted(false);
        setOpen(false);
        navigate("/items");
      } else {
        if (response.data.validate_error_message.title) {
          setErrorTitle(response.data.validate_error_message.title[0]);
        }
        if (response.data.validate_error_message.description) {
          setErrorDesc(response.data.validate_error_message.description[0]);
        }
        if (response.data.validate_error_message.category_id) {
          setErrorCategory(response.data.validate_error_message.category_id[0]);
        }
        if (response.data.message) {
          setErrorMessage(response.data.message);
        }
        setSubmitted(false);
      }
    } catch (error) {
      setErrorMessage("Something went wrong!");
    }
  };

  //   Edit
  const handleSubmitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      const url = import.meta.env.VITE_BACKEND_PORT;
      const title = formData.title;
      const description = formData.description;
      const category_id = categoryId;
      const response = await axiosInstance.post<ItemResponse>(
        `${url}items/update/${editItem?.id}`,
        {
          title,
          description,
          category_id,
        }
      );

      if (response.data.status == 200) {
        toast({
          title: "Item Update",
          description: "Item updated successfully!",
        });
        setFormData({
          title: "",
          description: "",
        });

        fetchItem(limit, keyword);

        setSubmitted(false);
        setEditOpen(false);
        navigate("/items");
      } else {
        if (response.data.validate_error_message.title) {
          setErrorTitle(response.data.validate_error_message.title[0]);
        }
        if (response.data.validate_error_message.description) {
          setErrorDesc(response.data.validate_error_message.description[0]);
        }
        if (response.data.validate_error_message.category_id) {
          setErrorCategory(response.data.validate_error_message.category_id[0]);
        }
        if (response.data.message) {
          setErrorMessage(response.data.message);
        }
        setSubmitted(false);
      }
    } catch (error) {
      setErrorMessage("Something went wrong!");
    }
  };

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(event.target.value); // Update the state with the selected option
    console.log(event.target.value);
  };

  //   Delete
  const handleDelete = async (id: string) => {
    try {
      const url = import.meta.env.VITE_BACKEND_PORT;
      const response = await axiosInstance.delete<ItemResponse>(
        `${url}items/delete/${id}`
      );

      if (response.data.success == true) {
        fetchItem(limit);
        toast({
          title: "Delete Item",
          description: "Item deleted successfully!",
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
        <title>DETL - Item</title>
      </Helmet>
      <div>
        <div className="flex justify-between items-center">
          <Breadcrumb page="Item" action="List" />
          <Button
            onClick={() => setOpen(true)}
            className="bg-black text-white py-2 px-4 rounded"
          >
            Add Item
          </Button>
        </div>
        <div>
          <div className="flex justify-end py-2">
            <Input
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // Do code here
                  e.preventDefault();

                  fetchItem(limit, keyword);
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
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Category
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
                  {items?.data.items.map((item, index) => {
                    return (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {index + 1}
                        </th>
                        <td className="px-6 py-4">{item.title}</td>
                        <td className="px-6 py-4">{item.description}</td>
                        <td className="px-6 py-4">{item.category.name}</td>
                        <td className="px-6 py-4">
                          {moment(item.created_at).format("LLL")}
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            onClick={() => {
                              setEditOpen(true);
                              setEditItem(item);
                              setFormData({
                                title: item.title,
                                description: item.description,
                              });
                              setCategoryId(item.category.id);
                            }}
                            className="bg-white hover:bg-white text-green-500 shadow-none"
                          >
                            Edit
                          </Button>
                          |{" "}
                          <Button
                            onClick={() => handleDelete(item.id)}
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
                      fetchItem(
                        limit,
                        keyword,
                        items!.data.pagination.current_page > 1
                          ? items!.data.pagination.current_page - 1
                          : undefined
                      );
                      setPage(
                        items!.data.pagination.current_page > 1
                          ? items!.data.pagination.current_page - 1
                          : undefined
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
                            fetchItem(limit, keyword, page);
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
                      fetchItem(
                        limit,
                        keyword,
                        items!.data.pagination.current_page <
                          items!.data.pagination.total
                          ? items!.data.pagination.current_page + 1
                          : undefined
                      );
                      setPage(
                        items!.data.pagination.current_page <
                          items!.data.pagination.total
                          ? items!.data.pagination.current_page + 1
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
      {/* Create */}
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Item</DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                <div>
                  <Label
                    htmlFor="name"
                    className={errorTitle ? "text-red-500" : ""}
                  >
                    Title
                  </Label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className={errorTitle ? "border-red-500" : ""}
                  />
                  {errorTitle ? (
                    <p className="text-red-500 text-sm">{errorTitle}</p>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="name"
                    className={errorDesc ? "text-red-500" : ""}
                  >
                    Description
                  </Label>
                  <Input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className={errorDesc ? "border-red-500" : ""}
                  />
                  {errorDesc ? (
                    <p className="text-red-500 text-sm">{errorDesc}</p>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="category"
                    className={errorCategory ? "text-red-500" : ""}
                  >
                    Category
                  </Label>
                  <select
                    name="category_id"
                    onChange={handleChangeSelect}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option>Select category</option>
                    {categories?.data.categories.map((c, index) => {
                      return (
                        <option value={c.id} key={index}>
                          {c.name}
                        </option>
                      );
                    })}
                  </select>

                  {errorCategory ? (
                    <p className="text-red-500 text-sm">{errorCategory}</p>
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

      {/* Edit */}
      <Dialog open={editOpen} onOpenChange={() => setEditOpen(!editOpen)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              <form
                onSubmit={handleSubmitEdit}
                className="flex flex-col space-y-3"
              >
                <div>
                  <Label
                    htmlFor="name"
                    className={errorTitle ? "text-red-500" : ""}
                  >
                    Title
                  </Label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className={errorTitle ? "border-red-500" : ""}
                  />
                  {errorTitle ? (
                    <p className="text-red-500 text-sm">{errorTitle}</p>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="name"
                    className={errorDesc ? "text-red-500" : ""}
                  >
                    Description
                  </Label>
                  <Input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className={errorDesc ? "border-red-500" : ""}
                  />
                  {errorDesc ? (
                    <p className="text-red-500 text-sm">{errorDesc}</p>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="category"
                    className={errorCategory ? "text-red-500" : ""}
                  >
                    Category
                  </Label>
                  <select
                    name="category_id"
                    onChange={handleChangeSelect}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option>Select category</option>
                    {categories?.data.categories.map((c, index) => {
                      return (
                        <option
                          value={c.id}
                          key={index}
                          selected={categoryId == c.id}
                        >
                          {c.name}
                        </option>
                      );
                    })}
                  </select>

                  {errorCategory ? (
                    <p className="text-red-500 text-sm">{errorCategory}</p>
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
  );
};

export default ItemPage;
