import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoEllipsisVertical,
  IoTrashOutline,
  IoCreateOutline,
  IoCloseOutline,
  IoCheckmarkSharp,
} from "react-icons/io5";

// Internal API Imports
import { deleteComment, UpdateComment } from "../../../../Api/FoodApi";
import "react-quill/dist/quill.snow.css";

const commentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function Comment({ cmtId, userName, myComment, myId }) {
  const client = useQueryClient();
  const currentUserId = localStorage.getItem("Id");
  const isOwner = String(currentUserId) === String(myId);

  // UI States
  const [isEditing, setIsEditing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [editedContent, setEditedContent] = useState(myComment);

  // 1. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteComment(id),
    onSuccess: (data) => {
      client.invalidateQueries(["allComment"]);
      if (data.status) toast.success("Comment removed");
      else toast.error("Unable to delete comment");
    },
  });

  // 2. Update Mutation
  const updateMutation = useMutation({
    mutationFn: (data) => UpdateComment(cmtId, data),
    onSuccess: (data) => {
      client.invalidateQueries(["allComment"]);
      if (data.status) {
        toast.success("Changes saved");
        setIsEditing(false);
      } else {
        toast.error("Update failed");
      }
    },
  });

  const handleUpdate = () => {
    if (!editedContent.trim()) return toast.warn("Comment cannot be empty");
    updateMutation.mutate({ comment: editedContent });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteMutation.mutate(cmtId);
    }
  };

  return (
    <motion.div
      variants={commentVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="w-full group bg-white border border-gray-100 p-5 rounded-[1.5rem] hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 mb-4"
    >
      <div className="flex justify-between items-start gap-4">
        {/* User Info & Content */}
        <div className="flex gap-4 flex-1">
          {/* Avatar Placeholder */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0 uppercase">
            {userName?.charAt(0) || "U"}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-black text-gray-900 text-sm tracking-tight">
                {userName}
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                • Just now
              </span>
            </div>

            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.div
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-600 text-sm leading-relaxed prose prose-sm prose-blue max-w-none"
                  dangerouslySetInnerHTML={{ __html: myComment }}
                />
              ) : (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="pt-2"
                >
                  <ReactQuill
                    theme="snow"
                    value={editedContent}
                    onChange={setEditedContent}
                    className="bg-gray-50 rounded-xl mb-4 overflow-hidden"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <IoCloseOutline size={16} /> Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      disabled={updateMutation.isPending}
                      className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-1"
                    >
                      {updateMutation.isPending ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <>
                          <IoCheckmarkSharp size={14} /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Ownership Actions Dropdown */}
        {isOwner && !isEditing && (
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all"
            >
              <IoEllipsisVertical />
            </button>

            <AnimatePresence>
              {showOptions && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowOptions(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden py-1"
                  >
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowOptions(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <IoCreateOutline size={16} /> Edit Review
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      {deleteMutation.isPending ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <>
                          <IoTrashOutline size={16} /> Delete
                        </>
                      )}
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Comment;
