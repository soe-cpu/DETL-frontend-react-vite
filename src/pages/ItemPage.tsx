import { category_columns } from "@/components/category/CategoryColumns";
import { item_columns } from "@/components/item/ItemColumns";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import categoryStore from "@/store/categoryStore";
import itemStore from "@/store/itemStore";
import { CategoryList, CategoryResponse } from "@/types/category";
import { ItemList, ItemResponse } from "@/types/item";
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
interface FormValues {
  title: string;
  description: string;
}

const ItemPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [limit, setLimit] = useState(16);
  const [keyword, setKeyword] = useState("");

  const { items, fetchItem } = itemStore();
  const { categories, fetchCategory } = categoryStore();

  useEffect(() => {
    fetchCategory(100);
    fetchItem(limit, keyword);
  }, [fetchItem, fetchCategory, limit, keyword]);

  const [formData, setFormData] = useState<FormValues>({
    title: "",
    description: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const [errorDesc, setErrorDesc] = useState("");
  const [errorCategory, setErrorCategory] = useState("");
  const [submitted, setSubmitted] = useState(false);

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

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(event.target.value); // Update the state with the selected option
    console.log(event.target.value);
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
          <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Item</DialogTitle>
                <DialogDescription>
                  <form
                    onSubmit={handleSubmit}
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
          <DataTable columns={item_columns} data={items?.data.items ?? []} />
          <div className="p-4">
            <div className="flex justify-between items-center">
              <Select
                onValueChange={(value) => {
                  setLimit(parseInt(value));
                  fetchItem(limit, keyword);
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="10 Rows" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="10">10 Rows</SelectItem>
                    <SelectItem value="20">20 Rows</SelectItem>
                    <SelectItem value="50">50 Rows</SelectItem>
                    <SelectItem value="100">100 Rows</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
