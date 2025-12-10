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
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 -mb-1 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
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
              <td className="px-4 py-3 text-sm text-gray-600">{startIndex + index}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-800">{user.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{user.initials}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{user.phone}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{user.role}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onStatusToggle(user.id)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    user.status ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      user.status ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{user.title}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
