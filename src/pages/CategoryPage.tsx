import { category_columns } from "@/components/category/CategoryColumns";
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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CategoryList, CategoryResponse } from "@/types/category";
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
interface FormValues {
  name: string;
}

const CategoryPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<CategoryList>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<CategoryResponse>(
          "/categories"
        );
        setCategories(response.data.data);
      } catch (err) {
        return null;
      }
    };

    fetchData();
  }, [categories]);

  const [formData, setFormData] = useState<FormValues>({
    name: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [errorName, setErrorName] = useState("");
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
      const name = formData.name;
      const response = await axiosInstance.post<CategoryResponse>(
        `${url}categories/create`,
        {
          name,
        }
      );

      if (response.data.success == false) {
        if (response.data.validate_error_message.name) {
          setErrorName(response.data.validate_error_message.name[0]);
        }
        if (response.data.message) {
          setErrorMessage(response.data.message);
        }
      }
      if (response.data.status == 200) {
        // Store token in localStorage
        setSubmitted(false);
        navigate("/categories");
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
        toast({
          title: "Delete Category",
          description: "Category deleted successfully!",
        });
      }
    } catch (error) {
      setErrorMessage("Something went wrong!");
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
          <Dialog>
            <DialogTrigger className="bg-black text-white py-2 px-4 rounded">
              Add Category
            </DialogTrigger>
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
            <Input placeholder="Search...." className="max-w-sm" />
          </div>
          <hr />
          <DataTable
            columns={category_columns}
            data={categories?.categories ?? []}
          />
          <div className="p-4">
            <div className="flex justify-between items-center">
              <Select>
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

export default CategoryPage;
