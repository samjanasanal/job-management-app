const API_BASE_URL = "http://13.210.33.250/api"

// Helper to get auth token from localStorage
const getAuthToken = () => localStorage.getItem("access_token")

const getCompanyId = () => {
  const companyId = localStorage.getItem("company_id")
  if (!companyId) {
    console.log("Warning: company_id not found in localStorage")
  }
  return companyId || ""
}

// Helper to create headers with proper company_id
const createHeaders = (includeAuth = true, isFormData = false) => {
  const headers = {
    Accept: "application/json",
  }

  const companyId = getCompanyId()
  if (companyId) {
    headers["company_id"] = companyId
  }

  if (includeAuth) {
    const token = getAuthToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json"
  }

  return headers
}

// Auth API
export const authAPI = {
  login: async (email, password, ipAddress = "") => {
    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)
    if (ipAddress) formData.append("ip_address", ipAddress)

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || "Login failed")
    }
    return data
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: createHeaders(),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || "Logout failed")
    }
    return data
  },
}

// User API
export const userAPI = {
  // Get all users with optional status filter
  getUsers: async (status = null) => {
    let url = `${API_BASE_URL}/user`
    if (status !== null && status !== "") {
      url += `?status=${status}`
    }

    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch users")
    }
    return data
  },

  // Get single user
  getUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: "GET",
      headers: createHeaders(),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user")
    }
    return data
  },

  // Add new user
  addUser: async (userData) => {
    const formData = new FormData()
    formData.append("name", userData.name)
    formData.append("email", userData.email)
    formData.append("role", userData.role)

    if (userData.phone) formData.append("phone", userData.phone)
    if (userData.title) formData.append("title", userData.title)
    if (userData.initials) formData.append("initials", userData.initials)
    if (userData.user_picture) formData.append("user_picture", userData.user_picture)
    if (userData.responsibilities && userData.responsibilities.length > 0) {
      formData.append("responsibilities", JSON.stringify(userData.responsibilities))
    }
    formData.append("overwite_data", userData.overwite_data || "0")

    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        company_id: getCompanyId(),
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || "Failed to add user")
    }
    return data
  },

  // Update user
  updateUser: async (userId, userData) => {
    const formData = new FormData()
    formData.append("name", userData.name)
    formData.append("email", userData.email)
    formData.append("role", userData.role)
    formData.append("_method", "put")

    if (userData.phone) formData.append("phone", userData.phone)
    if (userData.title) formData.append("title", userData.title)
    if (userData.initials) formData.append("initials", userData.initials)
    if (userData.user_picture) formData.append("user_picture", userData.user_picture)
    if (userData.responsibilities && userData.responsibilities.length > 0) {
      formData.append("responsibilities", JSON.stringify(userData.responsibilities))
    }

    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        company_id: getCompanyId(),
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || "Failed to update user")
    }
    return data
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: "DELETE",
      headers: createHeaders(),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete user")
    }
    return data
  },

  // Change user status
  changeStatus: async (userId, status) => {
    const formData = new FormData()
    formData.append("status", status ? "1" : "0")

    const response = await fetch(`${API_BASE_URL}/user/${userId}/status`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        company_id: getCompanyId(),
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || "Failed to change status")
    }
    return data
  },

  // Delete user image
  deleteUserImage: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/image`, {
      method: "DELETE",
      headers: createHeaders(),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete image")
    }
    return data
  },

  // Get roles dropdown
  getRoles: async (type = 1, id = "") => {
    const formData = new FormData()
    formData.append("type", type.toString())
    if (id) formData.append("id", id.toString())

    const response = await fetch(`${API_BASE_URL}/role/dropdown`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        company_id: getCompanyId(),
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch roles")
    }
    return data
  },

  // Get responsibilities dropdown
  getResponsibilities: async () => {
    const response = await fetch(`${API_BASE_URL}/user/dropdown-responsibility`, {
      method: "GET",
      headers: createHeaders(),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch responsibilities")
    }
    return data
  },

  // Check if email exists
  checkEmailExists: async (email, userId = "") => {
    const formData = new FormData()
    formData.append("email", email)
    if (userId) formData.append("user_id", userId.toString())

    const response = await fetch(`${API_BASE_URL}/user/check-mail-exist`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        company_id: getCompanyId(),
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || "Failed to check email")
    }
    return data
  },
}
