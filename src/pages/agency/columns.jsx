import { ArrowUpDown, Trash2, Pencil } from "lucide-react";

export const columns = (handleSort, onViewUser, onDeleteUser) => [
  {
    accessorKey: "name",
    header: () => (
      <span
        className="flex items-center hover:cursor-pointer"
        onClick={() => handleSort("name")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: () => (
      <span
        className="flex items-center hover:cursor-pointer"
        onClick={() => handleSort("email")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Pencil
          size="20"
          className="hover:cursor-pointer hover:text-blue-500"
          onClick={() => onViewUser(row.original)}
        />
        <Trash2
          size="20"
          className="hover:text-red-500 hover:cursor-pointer"
          onClick={() => onDeleteUser(row.original)}
        />
      </div>
    ),
  },
];
