"use client";

import React, { useState, useEffect } from "react";
import { INote, INoteForm } from "../lib/types";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: INoteForm) => Promise<void>;
  note?: INote | null;
  isLoading?: boolean;
}

const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  note,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<INoteForm>({
    notes_id: "",
    description: "",
    content: "",
    keyword: "",
    is_sensitive: false,
    dates: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!note;

  useEffect(() => {
    if (note) {
      setFormData({
        notes_id: note.notes_id,
        description: note.description,
        content: note.content,
        keyword: Array.isArray(note.keyword) ? note.keyword.join(", ") : "",
        is_sensitive: note.is_sensitive,
        dates: new Date(note.dates).toISOString().split("T")[0],
      });
    } else {
      setFormData({
        notes_id: "",
        description: "",
        content: "",
        keyword: "",
        is_sensitive: false,
        dates: new Date().toISOString().split("T")[0],
      });
    }
    setErrors({});
  }, [note, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }
    if (!formData.dates) {
      newErrors.dates = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {isEditMode ? "Edit Note" : "Create New Note"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter note description"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 placeholder-gray-400 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Enter note content"
                rows={5}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 placeholder-gray-400 resize-vertical ${
                  errors.content ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.content && (
                <p className="text-red-500 text-xs mt-1">{errors.content}</p>
              )}
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords
              </label>
              <input
                type="text"
                name="keyword"
                value={formData.keyword}
                onChange={handleChange}
                placeholder="Enter keywords separated by commas"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 placeholder-gray-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple keywords with commas (e.g., personal, work, ideas)
              </p>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dates"
                value={formData.dates}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 ${
                  errors.dates ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.dates && (
                <p className="text-red-500 text-xs mt-1">{errors.dates}</p>
              )}
            </div>

            {/* Is Sensitive */}
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <input
                type="checkbox"
                name="is_sensitive"
                id="is_sensitive"
                checked={formData.is_sensitive}
                onChange={handleChange}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <label
                htmlFor="is_sensitive"
                className="text-sm font-medium text-amber-800"
              >
                🔒 Mark as sensitive (content will be encrypted)
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading && (
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                )}
                {isEditMode ? "Update Note" : "Create Note"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;