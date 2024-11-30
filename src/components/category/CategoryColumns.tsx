import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Category, CategoryResponse } from "@/types/category";
import axiosInstance from "@/utils/axiosInstance";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreVertical, Trash2 } from "lucide-react";

export const category_columns: ColumnDef<Category>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original;

      //   Delete
      const handleDelete = async () => {
        try {
          const url = import.meta.env.VITE_BACKEND_PORT;
          const response = await axiosInstance.delete<CategoryResponse>(
            `${url}categories/delete/${category.id}`
          );

          if (response.data.success == true) {
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <a
                href={`/users/edit/${category.id}`}
                className="flex items-center gap-2 text-base text-black dark:text-white"
              >
                <Edit className="h-4 w-4" />
                Edit
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                onClick={() => handleDelete()}
                className="flex items-center gap-2 text-base text-red-500"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
