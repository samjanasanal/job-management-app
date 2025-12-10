"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Formik, Form, Field } from "formik"
import { Mail, Lock, Loader2 } from "lucide-react"
import { loginValidationSchema } from "../../utils/validationSchemas"
import { authAPI } from "../../services/api"
import { useToast } from "../../context/ToastContext"

function LoginForm() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    const companyId = localStorage.getItem("company_id")
    if (token && companyId) {
      navigate("/dashboard", { replace: true })
    }
  }, [navigate])

  const initialValues = {
    email: "",
    password: "",
    rememberMe: false,
  }

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setIsLoading(true)
    try {
      const response = await authAPI.login(values.email, values.password)

      // Store auth data
      if (response.access_token) {
        localStorage.setItem("access_token", response.access_token)
        localStorage.setItem("user", JSON.stringify(response))
        if (response.companies && response.companies.length > 0) {
          localStorage.setItem("company_id", response.companies[0].id)
        }
      }

      showToast("Login successful!", "success")
      navigate("/dashboard", { replace: true })
    } catch (error) {
      showToast(error.message || "Invalid credentials", "error")
      setFieldError("email", " ")
      setFieldError("password", "Invalid email or password")
    } finally {
      setIsLoading(false)
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6 md:p-8 shadow-2xl">
      <h2 className="text-white text-2xl font-semibold mb-1">Sign in</h2>
      <p className="text-gray-400 text-sm mb-6">Log in to manage your account</p>

      <Formik initialValues={initialValues} validationSchema={loginValidationSchema} onSubmit={handleSubmit}>
        {({ errors, touched, values, isValid, dirty }) => (
          <Form className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-300 text-sm">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className={`w-full bg-white/10 border ${errors.email && touched.email ? "border-red-500" : "border-white/20"} rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors`}
                />
              </div>
              {errors.email && touched.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-300 text-sm">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Field
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className={`w-full bg-white/10 border ${errors.password && touched.password ? "border-red-500" : "border-white/20"} rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors`}
                />
              </div>
              {errors.password && touched.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <Field
                  type="checkbox"
                  name="rememberMe"
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-gray-300 text-sm">Remember me</span>
              </label>
              <a href="#" className="text-purple-400 text-sm hover:text-purple-300 transition-colors">
                Forgot password ?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || !isValid || !dirty}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium py-3 rounded-lg transition-all duration-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default LoginForm
