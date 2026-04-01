import React from "react";
import { GRADIENT, GRADIENT_TEXT } from "./postTypes";

interface DeleteConfirmModalProps {
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isDeleting, onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40">
    <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
      <div className={`p-[2px] rounded-full ${GRADIENT} w-16 h-16 mx-auto mb-5`}>
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
          <i className={`ri-delete-bin-6-line text-2xl ${GRADIENT_TEXT}`} />
        </div>
      </div>
      <h3 className="text-base font-bold text-gray-800 mb-2">Permanently Delete Post?</h3>
      <p className="text-xs text-gray-400 mb-7 leading-relaxed">
        This will remove the post and all related data forever. This action cannot be undone.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-purple-100 text-gray-500 text-xs font-semibold hover:bg-purple-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className={`px-5 py-2.5 rounded-xl ${GRADIENT} text-white text-xs font-bold disabled:opacity-60 flex items-center gap-2 shadow-md shadow-purple-200`}
        >
          {isDeleting
            ? <><i className="ri-loader-4-line animate-spin" /> Deleting…</>
            : <><i className="ri-delete-bin-6-line" /> Delete Forever</>}
        </button>
      </div>
    </div>
  </div>
);

export default DeleteConfirmModal;
