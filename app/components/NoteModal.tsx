"use client";

import React, { useState, useEffect } from "react";
import { INote, INoteForm } from "../lib/types";
import Editor from "@monaco-editor/react";

const detectLanguageSimple = (code: string) => {
  const text = code.toLowerCase();

  if (text.includes("def ") || text.includes("import ")) return "python";
  if (text.includes("console.log") || text.includes("function"))
    return "javascript";
  if (text.includes("public static void main")) return "java";
  if (text.includes("#include")) return "cpp";
  if (text.includes("SELECT") || text.includes("FROM")) return "sql";
  if (text.includes("<html") || text.includes("<div")) return "html";
  if (text.includes("{") && text.includes("}")) return "json";

  return "plaintext";
};

const getLanguageFromKeyword = (keyword: string) => {
  const k = keyword.toLowerCase();

  if (k.includes("Python") || k.includes("py")) return "python";
  if (k.includes("Javascript") || k.includes("js")) return "javascript";
  if (k.includes("Typescript") || k.includes("ts")) return "typescript";
  if (k.includes("Html")) return "html";
  if (k.includes("Css")) return "css";
  if (k.includes("Json")) return "json";
  if (k.includes("Java")) return "java";
  if (k.includes("C++") || k.includes("Cpp")) return "cpp";
  if (k.includes("C#")) return "csharp";
  if (k.includes("Go")) return "go";
  if (k.includes("Rust")) return "rust";
  if (k.includes("Php")) return "php";
  if (k.includes("Sql")) return "sql";
  if (k.includes("Bash") || k.includes("Shell")) return "shell";

  return null;
};

const resolveLanguage = (keyword: string, content: string) => {
  const keywordLang = getLanguageFromKeyword(keyword);
  if (keywordLang) return keywordLang;

  return detectLanguageSimple(content);
};

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
        keyword: Array.isArray(note.keyword)
          ? note.keyword.join(", ")
          : "",
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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.content.trim())
      newErrors.content = "Content is required";
    if (!formData.dates) newErrors.dates = "Date is required";

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
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full h-full flex flex-col bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-4 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {isEditMode ? "Update your note" : "Create note"}
          </h2>
          <button onClick={onClose} className="text-white text-xl">
            ✕
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 overflow-hidden"
        >
          {/* LEFT PANEL */}
          <div className="w-full max-w-sm border-r p-6 space-y-6 overflow-y-auto">
            {/* Description */}
            <div>
              <label className="text-sm font-semibold">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full mt-2 border rounded-xl px-3 py-2"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="text-sm font-semibold">Date</label>
              <input
                type="date"
                name="dates"
                value={formData.dates}
                onChange={handleChange}
                className="w-full mt-2 border rounded-xl px-3 py-2"
              />
              {errors.dates && (
                <p className="text-red-500 text-sm">{errors.dates}</p>
              )}
            </div>

            {/* Keywords */}
            <div>
              <label className="text-sm font-semibold">Keywords</label>
              <input
                type="text"
                name="keyword"
                value={formData.keyword}
                onChange={handleChange}
                className="w-full mt-2 border rounded-xl px-3 py-2"
              />
            </div>

            {/* Sensitive */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_sensitive"
                checked={formData.is_sensitive}
                onChange={handleChange}
              />
              <label>Sensitive</label>
            </div>
          </div>

          {/* RIGHT PANEL (EDITOR) */}
          <div className="flex-1 flex flex-col p-6">
            <label className="text-sm font-semibold mb-2">Content</label>

            <div className="flex-1 border rounded-xl overflow-hidden">
              <Editor
                height="100%"
                language={
                  resolveLanguage(formData.keyword, formData.content)
                }
                theme="vs-dark"
                value={formData.content}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    content: value || "",
                  }))
                }
                options={{
                  fontSize: 14,
                  fontFamily: "monospace",
                  minimap: { enabled: false },
                  wordWrap: "on",
                  automaticLayout: true,
                }}
              />
            </div>

            {errors.content && (
              <p className="text-red-500 text-sm mt-2">
                {errors.content}
              </p>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-xl"
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl"
          >
            {isLoading
              ? "Saving..."
              : isEditMode
              ? "Update"
              : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;