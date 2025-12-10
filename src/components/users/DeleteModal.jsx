"use client"
import { AlertCircle } from "lucide-react"

function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm p-6 text-center">
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        {/* Message */}
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Are you sure want to delete?</h3>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border-2 border-blue-500 text-blue-500 font-medium rounded-full hover:bg-blue-50 transition-colors"
          >
            No, Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-full transition-colors"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
