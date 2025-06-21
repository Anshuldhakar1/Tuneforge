import { AlertTriangle, X } from "lucide-react";

type PlaylistDeleteModalProps = {
  open: boolean;
  onCancel: () => void;
  onDelete: () => void;
};

export function PlaylistDeleteModal({ open, onCancel, onDelete }: PlaylistDeleteModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 max-w-xs w-full animate-fadein-slideup relative">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle color="#ef4444" size={24} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Delete Playlist?
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
          Are you sure you want to delete this playlist? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1.5 rounded-full bg-[#ef4444] text-white font-medium hover:bg-[#d32f2f] transition text-sm"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
        <button
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onCancel}
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}