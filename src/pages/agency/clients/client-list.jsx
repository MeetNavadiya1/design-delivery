import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { parsePhoneNumberFromString } from "libphonenumber-js";
import DataTable from "../../../components/common/data-table";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowUpDown, SquarePen } from "lucide-react";
import { agencyClientServices } from "../../../services/agency-client-service";
import SearchInput from "../../../components/common/search-input";
import { toast } from "sonner";
import { HandleError } from "../../../services/handleError";

const columns = (handleSort, onEditClient) => [
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
    cell: ({ row }) => <span className="capitalize">{row.original.name}</span>,
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
    accessorKey: "mobileNumber",
    header: "Phone",
    cell: ({ row }) => (
      <span>
        {parsePhoneNumberFromString(
          row.original.mobileNumber,
          "IN",
        )?.formatInternational()}
      </span>
    ),
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditClient(row.original)}
            >
              <SquarePen
                size="25"
                className="hover:cursor-pointer text-green-500"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Edit</p>
          </TooltipContent>
        </Tooltip>
      </div>
    ),
  },
];

function ClientList() {
  const [users, setUsers] = useState([]);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");

  const [sortBy, setSortBy] = useState("createdAt");

  const [order, setOrder] = useState("desc");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getClients = async () => {
    try {
      setLoading(true);

      const response = await agencyClientServices.getClients({
        page,
        limit: 10,
        search,
        sort: sortBy,
        order,
      });

      if (response.success) {
        setUsers(response.data);
        setTotalPages(response.meta.totalPages);
      } else {
        toast.error(response.message || "Error occurred fetching clients!");
      }
    } catch (error) {
      HandleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClients();
  }, [page, search, sortBy, order]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchText);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const onEditClient = (row) => {
    navigate(`/agency/clients/${row.id}`);
  };

  

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center flex-col sm:flex-row sm:justify-between gap-3">
          <h2 className="text-xl font-medium">Clients</h2>
          <div className="w-full flex gap-4 items-center justify-end">
            <SearchInput
              search={searchText}
              setSearch={setSearchText}
              placeholder="clients"
            />
            <Button asChild>
              <Link
                to={`/agency/clients/+`}
                className="flex items-center gap-1"
              >
                <Plus /> Add Client
              </Link>
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns(handleSort, onEditClient)}
          data={users}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={loading}
        />
      </div>
    </div>
  );
}

export default ClientList;
