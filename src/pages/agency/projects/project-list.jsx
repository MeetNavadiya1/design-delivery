import DataTable from "../../../components/common/data-table";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { SquarePen, ArrowUpDown, Plus, View } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import SearchInput from "../../../components/common/search-input";
import { agencyProjectService } from "../../../services/agency-project-services";
import { toast } from "sonner";
import { HandleError } from "../../../services/handleError";

const statusColor = {
  complete: "bg-green-100 text-green-700",
  inProgress: "bg-blue-100 text-blue-700",
  draft: "bg-gray-100 text-gray-700",
};
const statusName = {
  complete: "Complete",
  inProgress: "In Progress",
  draft: "Draft",
};

const columns = (handleSort, onEditProject) => [
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
    accessorKey: "clientName",
    header: () => (
      <span
        className="flex items-center hover:cursor-pointer"
        onClick={() => handleSort("clientName")}
      >
        Client Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </span>
    ),
    cell: ({ row }) => <span className="capitalize">{row.original.client.name}</span>,
  },
  {
    accessorKey: "status",
    header: () => (
      <span className="flex items-center hover:cursor-pointer">Status</span>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge className={statusColor[status]}>{statusName[status]}</Badge>
      );
    },
  },
  {
    accessorKey: "tasks",
    header: () => (
      <span className="flex items-center hover:cursor-pointer">
        Total Tasks
      </span>
    ),
    cell: ({ row }) => <span>{row.original._count.tasks}</span>,
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
              onClick={(e) => {
                e.stopPropagation();
                onEditProject(row.original.id);
              }}
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

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");

  const [sortBy, setSortBy] = useState("createdAt");

  const [order, setOrder] = useState("desc");

  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("");

  const navigate = useNavigate();

  const getProject = async () => {
    setLoading(true);
    try {
      const response = await agencyProjectService.getProjects({
        page,
        limit: 10,
        search,
        sort: sortBy,
        order,
        statusFilter,
      });

      if (response.success) {
        setProjects(response.data);
        setTotalPages(response.meta.pages);
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
    getProject();
  }, [page, search, sortBy, order, statusFilter]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const onEditProject = (id) => {
    navigate(`/agency/projects/${id}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchText);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  function onViewProject(id) {
    navigate(`/agency/projects/${id}/tasks`);
  }


  return (
    <div className="space-y-4">
      <div className="flex items-center flex-col md:flex-row sm:justify-between gap-3">
        <h2 className="text-xl font-medium">Projects</h2>
        <div className="w-full flex gap-4 items-start md:justify-end flex-col-reverse md:flex-row">
          <SearchInput
            search={searchText}
            setSearch={setSearchText}
            placeholder="projects"
          />

          <div className="w-full md:w-fit flex gap-4 items-center justify-between md:justify-end">
            <Select
              onValueChange={(value) => {
                setLoading(true);
                setPage(1);
                setStatusFilter(value === "all" ? "" : value);
              }}
            >
              <SelectTrigger className="min-w-30 max-h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="inProgress">In Progress</SelectItem>
                  <SelectItem value="complete">Completed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button asChild>
              <Link to="/agency/projects/+" className="flex items-center gap-1">
                <Plus /> Add Project
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <DataTable
        columns={columns(
          handleSort,
          onEditProject,
          onViewProject,
        )}
        data={projects}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(nextPage) => {
          setLoading(true);
          setPage(nextPage);
        }}
        onViewProject={ onViewProject }
        isProjectListing={true}
        isLoading={loading}
      />
    </div>
  );
};

export default ProjectsList;
