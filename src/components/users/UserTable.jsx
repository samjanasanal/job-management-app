"use client"
import { Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react"

function UserTable({ users, startIndex, onStatusToggle, onEdit, onDelete }) {
  const columns = [
    { key: "sno", label: "S.I", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "initials", label: "Initials", sortable: true },
    { key: "phone", label: "Phone Number", sortable: true },
    { key: "role", label: "Role", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "title", label: "Title", sortable: true },
    { key: "action", label: "Action", sortable: false },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead style={{ backgroundColor: "#504A6E" }}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-[11px] font-semibold text-white uppercase tracking-wide"
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 -mb-1 text-white/60" />
                      <ChevronDown className="w-3 h-3 text-white/60" />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user, index) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-[13px] text-[#555555]">{startIndex + index}</td>
              <td className="px-4 py-3 text-[13px] font-medium text-[#555555]">{user.name}</td>
              <td className="px-4 py-3 text-[13px] text-[#555555]">{user.email}</td>
              <td className="px-4 py-3 text-[13px] text-[#555555]">{user.initials}</td>
              <td className="px-4 py-3 text-[13px] text-[#555555]">{user.phone}</td>
              <td className="px-4 py-3 text-[13px] text-[#555555]">{user.role}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onStatusToggle(user.id)}
                  className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                    user.status ? "bg-[#8570FF]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      user.status ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </td>
              <td className="px-4 py-3 text-[13px] text-[#555555]">{user.title}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-1.5 text-[#8570FF] hover:bg-[#8570FF]/10 rounded-lg transition-colors"
                    aria-label="Edit user"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Delete user"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserTable