"use client"

import { useState, useEffect, useCallback } from "react"
import { Users, Activity, DollarSign, TrendingUp, Loader2 } from "lucide-react"
import { userAPI } from "../services/api"

function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    loading: true,
  })

  const fetchUserStats = useCallback(async () => {
    try {
      const response = await userAPI.getUsers()
      if (response.status && response.data) {
        const totalUsers = response.data.length
        const activeUsers = response.data.filter((user) => user.status === true || user.status === 1).length
        setStats({
          totalUsers,
          activeUsers,
          loading: false,
        })
      }
    } catch (error) {
      console.error("Failed to fetch user stats:", error)
      setStats((prev) => ({ ...prev, loading: false }))
    }
  }, [])

  useEffect(() => {
    fetchUserStats()
  }, [fetchUserStats])

  const statCards = [
    {
      label: "Total Users",
      value: stats.loading ? "-" : stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "bg-purple-500",
    },
    {
      label: "Active Users",
      value: stats.loading ? "-" : stats.activeUsers.toLocaleString(),
      icon: Activity,
      color: "bg-green-500",
    },
    { label: "Revenue", value: "$45,231", icon: DollarSign, color: "bg-blue-500" },
    { label: "Growth", value: "+12.5%", icon: TrendingUp, color: "bg-orange-500" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  {stats.loading && (stat.label === "Total Users" || stat.label === "Active Users") ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  )}
                </div>
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
