"use client"

import { useState, useRef, useEffect } from "react"
import { Formik, Form, Field } from "formik"
import { X, User, Camera, Trash2, Loader2 } from "lucide-react"
import { userValidationSchema } from "../../utils/validationSchemas"

function EditUserModal({ isOpen, onClose, user, loading = false, onSave, roles = [], responsibilities = [] }) {
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [shouldDeleteImage, setShouldDeleteImage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isHoveringImage, setIsHoveringImage] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (user) {
      setImagePreview(user.profileImage || null)
      setImageFile(null)
      setShouldDeleteImage(false)
    }
  }, [user])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setShouldDeleteImage(false)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    if (user?.profileImage) {
      setShouldDeleteImage(true)
    }
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true)
    try {
      const userData = {
        ...values,
        id: user.id,
        user_picture: imageFile,
        deleteImage: shouldDeleteImage,
      }
      await onSave(userData)
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
    setShouldDeleteImage(false)
    setIsHoveringImage(false)
    onClose()
  }

  if (!isOpen) return null

  if (loading || !user) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-lg p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    )
  }

  const getUserResponsibilityIds = () => {
    if (!user.responsibilities) return []
    if (Array.isArray(user.responsibilities)) {
      return user.responsibilities
        .map((r) => {
          if (typeof r === "object" && r !== null) {
            return r.id || r.responsibility_id || ""
          }
          return r
        })
        .filter((id) => id !== "")
    }
    return []
  }

  const initialValues = {
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    title: user.title || "",
    initials: user.initials || "",
    role: user.roleId?.toString() || "",
    responsibilities: getUserResponsibilityIds(),
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Edit User</h2>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={userValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="p-6">
              {/* Avatar with Delete/Camera Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div
                    className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center border-2 border-purple-200 overflow-hidden cursor-pointer"
                    onMouseEnter={() => setIsHoveringImage(true)}
                    onMouseLeave={() => setIsHoveringImage(false)}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="User avatar"
                          className="w-full h-full object-cover"
                        />
                        {isHoveringImage && (
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                            <Camera className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </>
                    ) : (
                      <User className="w-10 h-10 text-purple-400" />
                    )}
                  </div>
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
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveImage()
                      }}
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
                    className={`w-full px-3 py-2.5 border ${errors.email && touched.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:border-purple-500`}
                  />
                  {errors.email && touched.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <Field
                    type="tel"
                    name="phone"
                    className={`w-full px-3 py-2.5 border ${errors.phone && touched.phone ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:border-purple-500`}
                  />
                  {errors.phone && touched.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <Field
                    type="text"
                    name="title"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initials</label>
                  <Field
                    type="text"
                    name="initials"
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
                    {roles.map((role) => (
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
                  {responsibilities.map((resp) => (
                    <label key={resp.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={values.responsibilities.some((id) => String(id) === String(resp.id))}
                        onChange={() => {
                          const respId = resp.id
                          const isSelected = values.responsibilities.some((id) => String(id) === String(respId))
                          const newResponsibilities = isSelected
                            ? values.responsibilities.filter((id) => String(id) !== String(respId))
                            : [...values.responsibilities, respId]
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
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default EditUserModal
