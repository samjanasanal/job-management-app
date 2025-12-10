"use client"

import { useEffect } from "react"
import { X, CheckCircle, XCircle } from "lucide-react"

function Toast({ message, type = "success", onClose, duration = 4000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500"
  const Icon = type === "success" ? CheckCircle : XCircle

  return (
    <div
      className={`fixed top-4 right-4 z-[100] flex items-center gap-3 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg animate-slide-in max-w-md`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast
