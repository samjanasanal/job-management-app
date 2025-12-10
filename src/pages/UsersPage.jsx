"use client"

import { useState, useMemo } from "react"
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import UserTable from "../components/users/UserTable"
import AddUserModal from "../components/users/AddUserModal"
import EditUserModal from "../components/users/EditUserModal"
import DeleteModal from "../components/users/DeleteModal"

const initialUsers = [
  {
    id: 1,
    name: "Travis Scott",
    email: "alma.lawson@example.com",
    initials: "B",
    phone: "0412 345 678",
    role: "Admin",
    status: true,
    title: "Admin",
  },
  {
    id: 2,
    name: "Jane Cooper",
    email: "willie.jennings@example.com",
    initials: "L",
    phone: "0412 345 678",
    role: "Supervisor",
    status: true,
    title: "Supervisor",
  },
  {
    id: 3,
    name: "Ronald Richards",
    email: "jackson.graham@example.com",
    initials: "R",
    phone: "0412 345 678",
    role: "Project Manager",
    status: false,
    title: "Supervisor",
  },
  {
    id: 4,
    name: "Darlene Robertson",
    email: "nathan.roberts@example.com",
    initials: "P",
    phone: "0412 345 678",
    role: "Project Manager",
    status: false,
    title: "Project Manager",
  },
  {
    id: 5,
    name: "Courtney Henry",
    email: "curtis.weaver@example.com",
    initials: "C",
    phone: "0412 345 678",
    role: "Project Manager",
    status: false,
    title: "Project Manager",
  },
  {
    id: 6,
    name: "Wade Warren",
    email: "kenzi.lawson@example.com",
    initials: "B",
    phone: "0412 345 678",
    role: "Supervisor",
    status: true,
    title: "Project Manager",
  },
  {
    id: 7,
    name: "Brooklyn Simmons",
    email: "felicia.reid@example.com",
    initials: "S",
    phone: "0412 345 678",
    role: "Supervisor",
    status: true,
    title: "Project Manager",
  },
  {
    id: 8,
    name: "Brooklyn Simmons",
    email: "felicia.reid@example.com",
    initials: "T",
    phone: "0412 345 678",
    role: "Project Manager",
    status: true,
    title: "Project Manager",
  },
  {
    id: 9,
    name: "Jenny Wilson",
    email: "nevaeh.simmons@example.com",
    initials: "M",
    phone: "0412 345 678",
    role: "Supervisor",
    status: true,
    title: "Project Manager",
  },
  {
    id: 10,
    name: "Robert Fox",
    email: "sara.cruz@example.com",
    initials: "P",
    phone: "0412 345 678",
    role: "Project Manager",
    status: true,
    title: "Project Manager",
  },
  {
    id: 11,
    name: "Leslie Alexander",
    email: "leslie.alex@example.com",
    initials: "L",
    phone: "0412 345 678",
    role: "Admin",
    status: true,
    title: "Admin",
  },
  {
    id: 12,
    name: "Michael Foster",
    email: "michael.foster@example.com",
    initials: "M",
    phone: "0412 345 678",
    role: "Supervisor",
    status: false,
    title: "Supervisor",
  },
]

function UsersPage() {
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const itemsPerPage = 10

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus =
        statusFilter === "" ||
        (statusFilter === "active" && user.status) ||
        (statusFilter === "inactive" && !user.status)
      return matchesSearch && matchesStatus
    })
  }, [users, searchQuery, statusFilter])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleStatusToggle = (userId) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: !user.status } : user)))
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  const handleDelete = (user) => {
    setSelectedUser(user)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id))
    setDeleteModalOpen(false)
    setSelectedUser(null)
  }

  const handleAddUser = (newUser) => {
    setUsers((prev) => [...prev, { ...newUser, id: Math.max(...prev.map((u) => u.id)) + 1 }])
    setAddModalOpen(false)
  }

  const handleUpdateUser = (updatedUser) => {
    setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
    setEditModalOpen(false)
    setSelectedUser(null)
  }

  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, filteredUsers.length)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Jobs Management</h1>

      {/* Filters and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 bg-white"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 bg-white min-w-[150px]"
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Add Button */}
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <UserTable
          users={paginatedUsers}
          startIndex={startIndex}
          onStatusToggle={handleStatusToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            showing {startIndex} to {endIndex} of {filteredUsers.length} results
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page ? "bg-purple-600 text-white" : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            {totalPages > 5 && (
              <>
                <span className="text-gray-400">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === totalPages ? "bg-purple-600 text-white" : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={handleAddUser} />

      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onSave={handleUpdateUser}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedUser(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export default UsersPage
