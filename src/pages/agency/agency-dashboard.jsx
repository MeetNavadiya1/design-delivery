import { Card, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import {
  IdCardLanyard,
  User,
  SquareChartGantt,
  ClipboardClock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { agencyClientServices } from "../../services/agency-client-service";

const statCards = [
  {
    id: 1,
    name: "Total Projects",
    key: "totalProjects",
    icon: <SquareChartGantt size={25} />,
    bg: "bg-purple-100",
    text: "text-purple-700",
  },
  {
    id: 2,
    name: "Total Employees",
    key: "totalEmployees",
    icon: <IdCardLanyard size={25} />,
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  {
    id: 3,
    name: "Total Clients",
    key: "totalClients",
    icon: <User size={25} />,
    bg: "bg-emerald-100",
    text: "text-emerald-700",
  },
  {
    id: 4,
    name: "Total Pending Tasks",
    key: "totalPendingTask",
    icon: <ClipboardClock size={25} />,
    bg: "bg-orange-100",
    text: "text-orange-700",
  },
];

function AgencyDashboard() {
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getDetails() {
      setLoading(true);
      try {
        const response = await agencyClientServices.getDashboardDetails();
        setDashboardStats(response.data || {});
      } catch (error) {
        toast.error(error.message || "Failed to load dashboard details");
      } finally {
        setLoading(false);
      }
    }
    getDetails();
  }, []);

  return (
    <>
      <h2 className="text-xl font-medium">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>
                <div className={`p-3 rounded-lg inline-flex ${item.bg}`}>
                  {item.icon}
                </div>
              </CardTitle>
              <CardAction className="text-end">
                <span className={`text-2xl font-semibold ${item.text}`}>
                  {loading ? "..." : (dashboardStats[item.key] ?? "0")}
                </span>
                <p className="font-semibold">{item.name}</p>
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
}

export default AgencyDashboard;
