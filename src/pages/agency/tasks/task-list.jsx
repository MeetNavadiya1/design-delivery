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
import {
  SquarePen,
  ArrowUpDown,
  Plus,
  SquareChartGantt,
  ClipboardClock,
  FileXCorner,
  CalendarCheck2,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { agencyTaskService } from "../../../services/agency-task-service";
import SearchInput from "../../../components/common/search-input";
import { Card, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { toast } from "sonner";

const statusColor = {
  complete: "bg-green-100 text-green-700",
  inProgress: "bg-blue-100 text-blue-700",
};
const statusName = {
  complete: "Complete",
  inProgress: "In Progress",
};

const columns = (handleSort, onEditTask) => [
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
    accessorKey: "employee.name",
    header: () => (
      <span
        className="flex items-center hover:cursor-pointer"
        onClick={() => handleSort("employee.name")}
      >
        Employee Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </span>
    ),
    cell: ({ row }) => <span className="capitalize">{ row.original.employee.name }</span>
  },
  {
    accessorKey: "version",
    header: () => (
      <span
        className="flex items-center hover:cursor-pointer"
        onClick={() => handleSort("version")}
      >
        Latest Version
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </span>
    ),
    cell: ({ row }) => {
      const version = row.original.assets[0]?.version || 0;
      return <Badge variant="outline">v{version}</Badge>;
    },
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
                onEditTask(row.original.id);
              }}
            >
              <SquarePen
                size="18"
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

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");

  const [sortBy, setSortBy] = useState("createdAt");

  const [order, setOrder] = useState("desc");

  const [loading, setLoading] = useState(false);

  const [statusFilter, setStatusFilter] = useState("");

  const [statusStats, setStatusStats] = useState({});

  const navigate = useNavigate();
  const { pid } = useParams();

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const onEditTask = (id) => {
    navigate(`/agency/projects/${pid}/tasks/${id}`);
  };

  const onViewTask = (id) => {
    navigate(`/agency/projects/${pid}/tasks/${id}/upload-task`);
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const response = await agencyTaskService.getTasks(pid, {
        page,
        limit: 10,
        search,
        status: statusFilter,
        sortBy,
        order,
      });

      setTasks(response.data);
      setTotalPages(response.meta?.pages);
    } catch (error) {
      toast.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    if (!pid) return;
    fetchTasks();
  }, [pid, page, search, sortBy, order, statusFilter]);

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await agencyTaskService.getaStastics(pid);
        setStatusStats(response.data);
      } catch (error) {
        toast.error("Error fetching task statistics:", error);
      }
    };

    getStats();
  }, [pid]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchText);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  const states = [
    {
      id: 1,
      name: " Tasks",
      key: "totalTaskCount",
      icon: <SquareChartGantt size="25" />,
      bg: "bg-purple-100",
      text: "text-purple-700",
    },
    {
      id: 2,
      name: "Completed Tasks",
      key: "totalCompletedTaskCount",
      icon: <CalendarCheck2 size="25" />,
      bg: "bg-emerald-100",
      text: "text-emerald-700",
    },
    {
      id: 3,
      name: "In Review Assets",
      key: "totalCountInReviewAsset",
      icon: <ClipboardClock size="25" />,
      bg: "bg-orange-100",
      text: "text-orange-700",
    },
    {
      id: 4,
      name: "Rejected Assets",
      key: "totalCountRejectedAsset",
      icon: <FileXCorner size="25" />,
      bg: "bg-red-100",
      text: "text-red-700",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="">
        <h2 className="text-xl font-semibold capitalize">
          {statusStats?.getProjectName || "Project"}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {states.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>
                <div className={`p-3 rounded-lg inline-flex ${item.bg}`}>
                  {item.icon}
                </div>
              </CardTitle>
              <CardAction className="text-end">
                <span className={`text-2xl font-semibold ${item.text}`}>
                  {loading ? "..." : (statusStats[item.key] ?? "0")}
                </span>
                <p className="font-semibold">{item.name}</p>
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="flex items-center flex-col sm:flex-row sm:justify-between gap-3">
        <h2 className="text-lg">Tasks</h2>

        <div className="w-full flex gap-4 items-start md:justify-end flex-col-reverse md:flex-row">
          <SearchInput
            search={searchText}
            setSearch={setSearchText}
            placeholder="tasks"
          />

          <div className="w-full md:w-fit flex gap-4 items-center justify-between md:justify-end">
            <Select
              onValueChange={(value) => {
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
                  <SelectItem value="inProgress">In Progress</SelectItem>
                  <SelectItem value="complete">Completed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button asChild>
              <Link
                to={`/agency/projects/${pid}/tasks/+`}
                className="flex items-center gap-1"
              >
                <Plus /> Add Task
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <DataTable
        columns={columns(handleSort, onEditTask, onViewTask)}
        data={tasks}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={loading}
        isTaskList={true}
        onViewTask={onViewTask}
      />
    </div>
  );
};

export default TaskList;
