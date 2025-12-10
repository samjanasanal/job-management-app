"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Search, Plus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import UserTable from "../components/users/UserTable"
import AddUserModal from "../components/users/AddUserModal"
import EditUserModal from "../components/users/EditUserModal"
import DeleteModal from "../components/users/DeleteModal"
import { userAPI } from "../services/api"
import { useToast } from "../context/ToastContext"

function UsersPage() {
  const { showToast } = useToast()
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [responsibilities, setResponsibilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const itemsPerPage = 10

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const statusParam = statusFilter === "active" ? 1 : statusFilter === "inactive" ? 0 : null
      const response = await userAPI.getUsers(statusParam)
      if (response.status && response.data) {
        // Transform API response to match our component structure
        const transformedUsers = response.data.map((user) => ({
          id: user.id,
          name: user.first_name + (user.last_name ? ` ${user.last_name}` : ""),
          email: user.email,
          initials: user.initials || user.first_name?.charAt(0) || "",
          phone: user.phone || "",
          role: user.role?.title || "",
          roleId: user.role?.id,
          status: user.status,
          title: user.title || "",
          profileImage: user.profile_image_url,
          responsibilities: user.responsibilities || [],
        }))
        setUsers(transformedUsers)
      }
    } catch (error) {
      showToast(error.message || "Failed to fetch users", "error")
      // Use mock data if API fails
      setUsers(getMockUsers())
    } finally {
      setLoading(false)
    }
  }, [statusFilter, showToast])

  // Fetch roles and responsibilities
  const fetchDropdownData = useCallback(async () => {
    try {
      const [rolesResponse, responsibilitiesResponse] = await Promise.all([
        userAPI.getRoles(1),
        userAPI.getResponsibilities(),
      ])

      if (rolesResponse.status && rolesResponse.data) {
        const allRoles = []
        if (rolesResponse.data.owner) allRoles.push({ id: rolesResponse.data.owner, title: "Owner" })
        if (rolesResponse.data.admin) allRoles.push({ id: rolesResponse.data.admin, title: "Admin" })
        if (rolesResponse.data.other_roles) {
          allRoles.push(...rolesResponse.data.other_roles)
        }
        setRoles(allRoles)
      }

      if (Array.isArray(responsibilitiesResponse)) {
        setResponsibilities(responsibilitiesResponse)
      }
    } catch (error) {
      // Use default values if API fails
      setRoles([
        { id: 1, title: "Admin" },
        { id: 2, title: "Supervisor" },
        { id: 3, title: "Project Manager" },
      ])
      setResponsibilities([
        { id: 1, title: "Designer" },
        { id: 2, title: "Project Manager" },
        { id: 3, title: "Production Manager" },
        { id: 4, title: "Sales Rep" },
      ])
    }
  }, [])

  useEffect(() => {
    fetchUsers()
    fetchDropdownData()
  }, [fetchUsers, fetchDropdownData])

  // Mock users for fallback
  const getMockUsers = () => [
    {
      id: 1,
      name: "Travis Scott",
      email: "alma.lawson@example.com",
      initials: "B",
      phone: "0412 345 678",
      role: "Admin",
      status: true,
      title: "Admin",
      responsibilities: [1, 2],
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
      responsibilities: [2, 3],
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
      responsibilities: [3],
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
      responsibilities: [1, 4],
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
      responsibilities: [2],
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
      responsibilities: [3, 4],
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
      responsibilities: [1],
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
      responsibilities: [2, 3],
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
      responsibilities: [4],
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
      responsibilities: [1, 2, 3],
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
      responsibilities: [2],
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
      responsibilities: [1, 3],
    },
  ]

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
  }, [users, searchQuery])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Handle status toggle with API
  const handleStatusToggle = async (userId) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    // Optimistically update UI
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: !u.status } : u)))

    try {
      await userAPI.changeStatus(userId, !user.status)
      showToast("Status changed successfully", "success")
    } catch (error) {
      // Revert on error
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: user.status } : u)))
      showToast(error.message || "Failed to change status", "error")
    }
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  const handleDelete = (user) => {
    setSelectedUser(user)
    setDeleteModalOpen(true)
  }

  // Handle delete with API
  const handleConfirmDelete = async () => {
    if (!selectedUser) return

    setActionLoading(true)
    try {
      await userAPI.deleteUser(selectedUser.id)
      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id))
      showToast("User deleted successfully", "success")
      setDeleteModalOpen(false)
      setSelectedUser(null)
    } catch (error) {
      showToast(error.message || "Failed to delete user", "error")
    } finally {
      setActionLoading(false)
    }
  }

  // Handle add user with API
  const handleAddUser = async (newUser) => {
    setActionLoading(true)
    try {
      await userAPI.addUser(newUser)
      showToast("User added successfully", "success")
      setAddModalOpen(false)
      fetchUsers() // Refresh the list
    } catch (error) {
      showToast(error.message || "Failed to add user", "error")
      throw error // Re-throw to let modal handle it
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateUser = async (updatedUser) => {
    setActionLoading(true)
    try {
      if (updatedUser.deleteImage && selectedUser?.id) {
        try {
          await userAPI.deleteUserImage(selectedUser.id)
        } catch (imgError) {
          console.log("Image deletion error:", imgError)
        }
      }
      await userAPI.updateUser(updatedUser.id, updatedUser)
      showToast("User updated successfully", "success")
      setEditModalOpen(false)
      setSelectedUser(null)
      fetchUsers() // Refresh the list
    } catch (error) {
      showToast(error.message || "Failed to update user", "error")
      throw error
    } finally {
      setActionLoading(false)
    }
  }

  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, filteredUsers.length)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

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
            showing {filteredUsers.length > 0 ? startIndex : 0} to {endIndex} of {filteredUsers.length} results
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
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddUser}
        roles={roles}
        responsibilities={responsibilities}
      />

      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onSave={handleUpdateUser}
        roles={roles}
        responsibilities={responsibilities}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedUser(null)
        }}
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
      />
    </div>
  )
}

export default UsersPage
