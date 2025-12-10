"use client"

import { useState, useRef } from "react"
import { Formik, Form, Field } from "formik"
import { X, User, Camera, Trash2, Loader2 } from "lucide-react"
import { userValidationSchema } from "../../utils/validationSchemas"

function AddUserModal({ isOpen, onClose, onAdd, roles = [], responsibilities = [] }) {
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    title: "",
    initials: "",
    role: "",
    responsibilities: [],
  }

  const defaultRoles =
    roles.length > 0
      ? roles
      : [
          { id: "1", title: "Admin" },
          { id: "2", title: "Supervisor" },
          { id: "3", title: "Project Manager" },
        ]

  const defaultResponsibilities =
    responsibilities.length > 0
      ? responsibilities
      : [
          { id: 1, title: "Designer" },
          { id: 2, title: "Project Manager" },
          { id: 3, title: "Production Manager" },
          { id: 4, title: "Sales Rep" },
        ]

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true)
    try {
      const userData = {
        ...values,
        user_picture: imageFile,
      }
      await onAdd(userData)
      resetForm()
      handleRemoveImage()
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsSubmitting(false)
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setImagePreview(null)
    setImageFile(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Add New User</h2>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <Formik initialValues={initialValues} validationSchema={userValidationSchema} onSubmit={handleSubmit}>
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="p-6">
              {/* Avatar with Camera Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center border-2 border-purple-200 overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-purple-400" />
                    )}
                  </div>
                  {/* Camera icon - bottom right for add */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -bottom-1 -right-1 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors shadow-md"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name<span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    className={`w-full px-3 py-2.5 border ${errors.name && touched.name ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:border-purple-500`}
                  />
                  {errors.name && touched.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email<span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className={`w-full px-3 py-2.5 border ${errors.email && touched.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:border-purple-500`}
                  />
                  {errors.email && touched.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <Field
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    className={`w-full px-3 py-2.5 border ${errors.phone && touched.phone ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:border-purple-500`}
                  />
                  {errors.phone && touched.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <Field
                    type="text"
                    name="title"
                    placeholder="Enter your title"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initials</label>
                  <Field
                    type="text"
                    name="initials"
                    placeholder="Enter your initials"
                    className={`w-full px-3 py-2.5 border ${errors.initials && touched.initials ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:border-purple-500`}
                  />
                  {errors.initials && touched.initials && (
                    <p className="text-red-500 text-xs mt-1">{errors.initials}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role<span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="role"
                    className={`w-full px-3 py-2.5 border ${errors.role && touched.role ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:border-purple-500 bg-white`}
                  >
                    <option value="">Select your role</option>
                    {defaultRoles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.title}
                      </option>
                    ))}
                  </Field>
                  {errors.role && touched.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                </div>
              </div>

              {/* Designation / Responsibilities */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Designation<span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4">
                  {defaultResponsibilities.map((resp) => (
                    <label key={resp.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={values.responsibilities.includes(resp.id)}
                        onChange={() => {
                          const newResponsibilities = values.responsibilities.includes(resp.id)
                            ? values.responsibilities.filter((id) => id !== resp.id)
                            : [...values.responsibilities, resp.id]
                          setFieldValue("responsibilities", newResponsibilities)
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-600">{resp.title}</span>
                    </label>
                  ))}
                </div>
                {errors.responsibilities && touched.responsibilities && (
                  <p className="text-red-500 text-xs mt-1">{errors.responsibilities}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add New User"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddUserModal
