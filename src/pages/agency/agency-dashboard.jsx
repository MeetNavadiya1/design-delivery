import React, { useMemo, useState } from "react";
import AgencyNavbar from "../../components/agency/agency-navbar";
import AgencySidebar from "../../components/agency/agency-sidebar";
import AgencyLayout from "../../Layouts/agency-layout";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Folders,
  IdCard,
  UsersRound,
} from "lucide-react";

const AgencyDashboard = () => {
  const [view, setView] = useState("monthly");

  // 🔹 Monthly Data
  const monthlyData = [
    { month: "Jan", clients: 5 },
    { month: "Feb", clients: 8 },
    { month: "Mar", clients: 12 },
    { month: "Apr", clients: 16 },
    { month: "May", clients: 20 },
    { month: "Jun", clients: 24 },
    { month: "Jul", clients: 28 },
    { month: "Aug", clients: 32 },
    { month: "Sep", clients: 36 },
    { month: "Oct", clients: 40 },
    { month: "Nov", clients: 35 },
    { month: "Dec", clients: 30 },
  ];

  // 🔥 Convert Monthly → Quarterly (optimized)
  const quarterlyData = useMemo(() => {
    const quarters = [
      { label: "Q1", months: [0, 1, 2] },
      { label: "Q2", months: [3, 4, 5] },
      { label: "Q3", months: [6, 7, 8] },
      { label: "Q4", months: [9, 10, 11] },
    ];

    return quarters.map((q) => {
      const total = q.months.reduce(
        (sum, index) => sum + monthlyData[index].clients,
        0,
      );
      return { name: q.label, clients: total };
    });
  }, []);

  const data =
    view === "monthly"
      ? monthlyData.map((d) => ({ name: d.month, clients: d.clients }))
      : quarterlyData;

  // 🔥 Custom Tooltip (matches your UI)
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-indigo-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
          <p className="text-xs opacity-80">{label}</p>
          <p className="font-semibold">+{payload[0].value} New Clients</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <>
        <div className="p-4 md:p-6 min-h-screen">
          <h2 className="text-heading">Dashboard</h2>

          <div className="mt-5 mb-5 flex flex-wrap gap-5">
                <div className="p-4 md:p-6 shadow-sm bg-white rounded-xl flex flex-col w-40">
                    <Folders size={40} className="text-purple-700 bg-purple-100 rounded-xl p-2 mb-3"/>
                    <p className="text-small font-semibold text-gray-500">Total Projects</p>
                    <span className="text-subheading font-black">124</span>
                </div>

                <div className="p-4 md:p-6 shadow-sm bg-white rounded-xl flex flex-col w-40">
                    <IdCard size={40} className="text-primary bg-indigo-100 rounded-xl p-2 mb-3"/>
                    <p className="text-small font-semibold text-gray-500">Total Projects</p>
                    <span className="text-subheading font-black">124</span>
                </div>

                <div className="p-4 md:p-6 shadow-sm bg-white rounded-xl flex flex-col w-40">
                    <UsersRound size={40} className="text-yellow-700 bg-yellow-100 rounded-xl p-2 mb-3"/>
                    <p className="text-small font-semibold text-gray-500">Total Projects</p>
                    <span className="text-subheading font-black">124</span>
                </div>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-subheading font-semibold text-gray-800">
                  Client Growth
                </h2>
                <p className="text-xs md:text-sm text-gray-400">
                  New client acquisitions over time
                </p>
              </div>

              {/* TOGGLE */}
              <div className="bg-gray-100 p-1 rounded-lg flex gap-1 w-fit">
                <button
                  onClick={() => setView("monthly")}
                  className={`px-3 py-1 text-sm rounded-md transition cursor-pointer ${
                    view === "monthly"
                      ? "bg-white shadow font-medium"
                      : "text-gray-500"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setView("quarterly")}
                  className={`px-3 py-1 text-sm rounded-md transition cursor-pointer ${
                    view === "quarterly"
                      ? "bg-white shadow font-medium"
                      : "text-gray-500"
                  }`}
                >
                  Quarterly
                </button>
              </div>
            </div>

            {/* CHART */}
            <div className="w-full h-55 sm:h-65 md:h-75">
              <ResponsiveContainer>
                <AreaChart data={data}>
                  {/* GRADIENT */}
                  <defs>
                    <linearGradient
                      id="colorClients"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  {/* GRID */}
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                  />

                  {/* X AXIS */}
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  {/* TOOLTIP */}
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: "#6C63FF", strokeWidth: 1 }}
                  />

                  {/* AREA */}
                  <Area
                    type="monotone"
                    dataKey="clients"
                    stroke="#6366F1"
                    strokeWidth={3}
                    fill="url(#colorClients)"
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default AgencyDashboard;
