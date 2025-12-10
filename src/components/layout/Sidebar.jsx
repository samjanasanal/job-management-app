"use client"
import { NavLink, useNavigate } from "react-router-dom"
import { LayoutDashboard, Users, Users2, Settings, LogOut, X } from "lucide-react"
import { authAPI } from "../../services/api"
import { useToast } from "../../context/ToastContext"

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      showToast("Logged out successfully", "success")
    } catch (error) {
      console.log("Logout API error:", error)
    } finally {
      localStorage.removeItem("access_token")
      localStorage.removeItem("user")
      localStorage.removeItem("company_id")
      navigate("/login", { replace: true })
    }
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "User Management", path: "/dashboard/users" },
    { icon: Users2, label: "Team", path: "/dashboard/team" },
  ]

  const settingsItems = [{ icon: Settings, label: "Settings", path: "/dashboard/settings" }]

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-indigo-950 text-white z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button for mobile */}
        <button onClick={onClose} className="lg:hidden absolute top-4 right-4 p-1 hover:bg-white/10 rounded">
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="p-6 pb-4">
          <h1 className="text-2xl font-bold italic">LOGO</h1>
        </div>

        {/* Main Menu */}
        <div className="px-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 px-3">Main Menu</p>
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive ? "bg-purple-600 text-white" : "text-gray-300 hover:bg-white/10"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Settings */}
        <div className="px-4 mt-6">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 px-3">Settings</p>
          <nav className="flex flex-col gap-1">
            {settingsItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive ? "bg-purple-600 text-white" : "text-gray-300 hover:bg-white/10"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:bg-white/10 rounded-lg transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
