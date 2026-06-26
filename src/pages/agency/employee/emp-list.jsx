import DataTable from "../../../components/common/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useState, useEffect } from "react";
import { SquarePen, ArrowUpDown, Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import SearchInput from "../../../components/common/search-input";
import { agencyEmployeeService } from "../../../services/agency-employee-services";
import { toast } from "sonner";
import { HandleError } from "../../../services/handleError";

const columns = (handleSort, onEditEmp) => [
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
    cell: ({ row }) => (<span className="capitalize">{ row.original.name }</span>)
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
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditEmp(row.original.id)}
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

const EmployeeList = () => {
  const [emp, setEmp] = useState([]);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");

  const [sortBy, setSortBy] = useState("createdAt");

  const [order, setOrder] = useState("asc");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const onEditEmployee = (empId) => {
    navigate(`/agency/employees/${empId}`);
  };

  const getEmp = async () => {
    try {
      setLoading(true);

      const response = await agencyEmployeeService.getEmployees({
        page,
        limit: 10,
        search,
        sort: sortBy,
        order,
      });

      if (response.success) {
        setEmp(response.data);
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
    getEmp();
  }, [page, search, sortBy, order]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchText);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  return (
    <div className="space-y-4">
      <div className="flex items-center flex-col sm:flex-row sm:justify-between gap-3">
        <h2 className="text-xl font-medium">Employees</h2>
        <div className="w-full flex gap-4 items-center justify-end">
          <SearchInput
            search={searchText}
            setSearch={setSearchText}
            placeholder="employees"
          />
          <Button asChild>
            <Link to="/agency/employees/+" className="flex items-center gap-1">
              <Plus /> Add Employee
            </Link>
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns(handleSort, onEditEmployee)}
        data={emp}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={loading}
      />
    </div>
  );
};

export default EmployeeList;
