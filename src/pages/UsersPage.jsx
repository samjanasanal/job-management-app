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
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [editUserLoading, setEditUserLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const itemsPerPage = 10

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const statusParam = statusFilter === "active" ? 1 : statusFilter === "inactive" ? 0 : null
      const response = await userAPI.getUsers(statusParam)
      if (response.status && response.data) {
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
    } finally {
      setLoading(false)
    }
  }, [statusFilter, showToast])

  const fetchDropdownData = useCallback(async () => {
    try {
      const [rolesResponse, responsibilitiesResponse] = await Promise.all([
        userAPI.getRoles(1),
        userAPI.getResponsibilities(),
      ])

      // Parse roles - API returns { "role_name": "role_id", ... }
      if (rolesResponse.status && rolesResponse.data) {
        const rolesData = rolesResponse.data
        const allRoles = []

        // Convert object { "Admin": "id1", "Demo Role": "id2" } to array [{ id, title }]
        Object.entries(rolesData).forEach(([title, id]) => {
          // Skip if it's a nested object like 'other_roles'
          if (typeof id === "string") {
            allRoles.push({ id, title })
          }
        })

        // Also handle other_roles array if present
        if (rolesData.other_roles && Array.isArray(rolesData.other_roles)) {
          allRoles.push(...rolesData.other_roles)
        }

        setRoles(allRoles)
      }

      // Parse responsibilities - check response format
      if (responsibilitiesResponse.status && responsibilitiesResponse.data) {
        const respData = responsibilitiesResponse.data

        // If data is object like { "Designer": "id1", ... }, convert to array
        if (typeof respData === "object" && !Array.isArray(respData)) {
          const respArray = Object.entries(respData).map(([title, id]) => ({
            id,
            title,
          }))
          setResponsibilities(respArray)
        } else if (Array.isArray(respData)) {
          setResponsibilities(respData)
        }
      } else if (Array.isArray(responsibilitiesResponse)) {
        setResponsibilities(responsibilitiesResponse)
      }
    } catch (error) {
      console.log("Failed to fetch dropdown data:", error)
      // Don't set defaults - keep empty arrays
      setRoles([])
      setResponsibilities([])
    }
  }, [])

  useEffect(() => {
    fetchUsers()
    fetchDropdownData()
  }, [fetchUsers, fetchDropdownData])

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

  const handleStatusToggle = async (userId) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: !u.status } : u)))

    try {
      await userAPI.changeStatus(userId, !user.status)
      showToast("Status changed successfully", "success")
    } catch (error) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: user.status } : u)))
      showToast(error.message || "Failed to change status", "error")
    }
  }

  const handleEdit = async (user) => {
    setSelectedUserId(user.id)
    setEditModalOpen(true)
    setEditUserLoading(true)

    try {
      const response = await userAPI.getUser(user.id)
      if (response.status && response.data) {
        const userData = response.data
        setSelectedUser({
          id: userData.id,
          name: userData.first_name + (userData.last_name ? ` ${userData.last_name}` : ""),
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: userData.email,
          initials: userData.initials || "",
          phone: userData.phone || "",
          role: userData.role?.title || "",
          roleId: userData.role?.id || "",
          status: userData.status,
          title: userData.title || "",
          profileImage: userData.profile_image_url,
          responsibilities: userData.responsibilities || [],
        })
      }
    } catch (error) {
      showToast(error.message || "Failed to fetch user details", "error")
      setEditModalOpen(false)
    } finally {
      setEditUserLoading(false)
    }
  }

  const handleDelete = (user) => {
    setSelectedUser(user)
    setDeleteModalOpen(true)
  }

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

  const handleAddUser = async (newUser) => {
    setActionLoading(true)
    try {
      await userAPI.addUser(newUser)
      showToast("User added successfully", "success")
      setAddModalOpen(false)
      fetchUsers()
    } catch (error) {
      showToast(error.message || "Failed to add user", "error")
      throw error
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
      fetchUsers()
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
          setSelectedUserId(null)
        }}
        user={selectedUser}
        loading={editUserLoading}
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
