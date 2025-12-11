import { Bell } from "lucide-react"

function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#555555]">Jobs Management</h1>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell className="w-5 h-5 text-[#555555]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#8570FF]/30 bg-gray-200">
            <img src="/profile-pic.png" alt="User avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
