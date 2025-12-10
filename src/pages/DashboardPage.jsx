import { Users, TrendingUp, Activity, DollarSign } from "lucide-react"

function DashboardPage() {
  const stats = [
    { label: "Total Users", value: "2,543", icon: Users, color: "bg-purple-500" },
    { label: "Active Users", value: "1,832", icon: Activity, color: "bg-green-500" },
    { label: "Revenue", value: "$45,231", icon: DollarSign, color: "bg-blue-500" },
    { label: "Growth", value: "+12.5%", icon: TrendingUp, color: "bg-orange-500" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardPage
