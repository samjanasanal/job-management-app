"use client"
import { AlertCircle, Loader2 } from "lucide-react"

function DeleteModal({ isOpen, onClose, onConfirm, loading = false }) {
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

        <h3 className="text-base font-semibold text-[#555555] mb-6">Are you sure want to delete?</h3>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 text-[14px] border-2 border-[#8570FF] text-[#8570FF] font-medium rounded-full hover:bg-[#8570FF]/10 transition-colors disabled:opacity-50"
          >
            No, Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 text-[14px] bg-red-500 hover:bg-red-600 text-white font-medium rounded-full transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal