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

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-6xl rounded-4xl bg-white shadow-[0_35px_60px_-15px_rgba(16,185,129,0.35)] border border-emerald-100 overflow-hidden">
          <div className="bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-500 px-8 py-6 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">
                  {isEditMode ? "Update your note" : "Create note"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-2xl bg-white/10 p-2 transition hover:bg-white/20"
                aria-label="Close modal"
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
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Capture the note title"
                  className={`w-full rounded-3xl border px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition ${
                    errors.description ? "border-red-300" : "border-slate-200"
                  }`}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">
                  Date
                </label>
                <input
                  type="date"
                  name="dates"
                  value={formData.dates}
                  onChange={handleChange}
                  className={`w-full rounded-3xl border px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition ${
                    errors.dates ? "border-red-300" : "border-slate-200"
                  }`}
                />
                {errors.dates && (
                  <p className="text-sm text-red-600">{errors.dates}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write the note content here..."
                rows={7}
                className={`w-full rounded-[28px] border px-4 py-4 text-slate-900 placeholder-slate-400 shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition textarea-scrollbar-rounded ${
                  errors.content ? "border-red-300" : "border-slate-200"
                }`}
              />
              {errors.content && (
                <p className="text-sm text-red-600 mt-2">{errors.content}</p>
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">
                  Keywords
                </label>
                <input
                  type="text"
                  name="keyword"
                  value={formData.keyword}
                  onChange={handleChange}
                  placeholder="personal, work, idea"
                  className="w-full rounded-3xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                />
                <p className="text-xs text-slate-500">
                  Separate keywords with commas.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">Sensitive</label>
                <div className="flex items-center gap-3 p-4 rounded-[28px] border border-emerald-100 bg-emerald-50">
                  <input
                    type="checkbox"
                    name="is_sensitive"
                    id="is_sensitive"
                    checked={formData.is_sensitive}
                    onChange={handleChange}
                    className="h-5 w-5 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-400"
                  />
                  <label htmlFor="is_sensitive" className="text-sm font-medium text-slate-700">
                    Keep this note encrypted
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:items-center pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-3xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/40 hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? "Saving..." : isEditMode ? "Update Note" : "Save Note"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;