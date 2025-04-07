
import { Bell, LineChart, Users } from "lucide-react";
import { RiskDistribution } from "@/utils/mockData";

interface DashboardHeaderProps {
  riskDistribution: RiskDistribution;
  totalPatients: number;
  unreadAlerts: number;
  onAlertsClick: () => void;
}

const DashboardHeader = ({
  riskDistribution,
  totalPatients,
  unreadAlerts,
  onAlertsClick
}: DashboardHeaderProps) => {
  const stats = [
    {
      title: "High Risk Patients",
      value: riskDistribution.high,
      icon: <LineChart className="h-5 w-5 text-risk-high" />,
      color: "text-risk-high",
      bgColor: "bg-red-50"
    },
    {
      title: "Medium Risk Patients",
      value: riskDistribution.medium,
      icon: <LineChart className="h-5 w-5 text-risk-medium" />,
      color: "text-risk-medium",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Low Risk Patients",
      value: riskDistribution.low,
      icon: <LineChart className="h-5 w-5 text-risk-low" />,
      color: "text-risk-low",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Patients",
      value: totalPatients,
      icon: <Users className="h-5 w-5 text-primary" />,
      color: "text-primary",
      bgColor: "bg-blue-50"
    }
  ];

  return (
    <header className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Insights Dashboard</h1>
          <p className="text-gray-500">Monitor and analyze patient risk predictions</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onAlertsClick}
            className="relative p-2 rounded-full bg-white shadow hover:bg-gray-50 transition-colors"
          >
            <Bell className="h-5 w-5 text-gray-700" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 bg-risk-high text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadAlerts}
              </span>
            )}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium">
              DR
            </div>
            <span className="text-sm font-medium">Dr. Richards</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg p-4 shadow flex items-center gap-4 card-hover"
          >
            <div className={`${stat.bgColor} p-3 rounded-full`}>
              {stat.icon}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </header>
  );
};

export default DashboardHeader;
