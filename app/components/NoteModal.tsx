"use client";

import React, { useState, useEffect, useRef } from "react";
import { INote, INoteForm } from "../lib/types";
import Editor from "@monaco-editor/react";

const detectLanguageSimple = (code: string) => {
  const text = code.toLowerCase();

  if (text.includes("def ") || text.includes("import ")) return "python";
  if (text.includes("console.log") || text.includes("function"))
    return "javascript";
  if (text.includes("public static void main")) return "java";
  if (text.includes("#include")) return "cpp";
  if (text.includes("select") || text.includes("from")) return "sql";
  if (text.includes("<html") || text.includes("<div")) return "html";
  if (text.includes("{") && text.includes("}")) return "json";

  return "plaintext";
};

const getLanguageFromKeyword = (keyword: string) => {
  const k = keyword.toLowerCase();

  if (k.includes("python") || k.includes("py")) return "python";
  if (k.includes("javascript") || k.includes("js")) return "javascript";
  if (k.includes("typescript") || k.includes("ts")) return "typescript";
  if (k.includes("html")) return "html";
  if (k.includes("css")) return "css";
  if (k.includes("json")) return "json";
  if (k.includes("java")) return "java";
  if (k.includes("c++") || k.includes("cpp")) return "cpp";
  if (k.includes("c#")) return "csharp";
  if (k.includes("go")) return "go";
  if (k.includes("rust")) return "rust";
  if (k.includes("php")) return "php";
  if (k.includes("sql")) return "sql";
  if (k.includes("bash") || k.includes("shell")) return "shell";

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
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(true);
  const [showMobileMeta, setShowMobileMeta] = useState(false);

  const editorRef = useRef<any>(null);

  const isEditMode = !!note;
  const currentLanguage = resolveLanguage(formData.keyword, formData.content);
  const isPython = currentLanguage === "python";
  const isPlainText = currentLanguage === "plaintext";
  const isProgrammingLanguage = !isPlainText;

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
    setOutput("");
    setShowMobileMeta(false);
  }, [note, isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [showOutput, showMobileMeta]);

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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  const handleRunPython = async () => {
    if (!isPython) {
      setOutput("Code execution is only available for Python.");
      return;
    }

    if (!formData.content.trim()) {
      setOutput("No Python code to run.");
      return;
    }

    setIsRunning(true);
    setOutput("Running...");
    setShowOutput(true);

    try {
      const response = await fetch(process.env.LOCAL_PYTHON_COMPILER_API!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: formData.content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setOutput(data?.output || "Failed to run Python code.");
        return;
      }

      setOutput(data?.output || "");
    } catch (error) {
      setOutput("Unable to connect to Python backend.");
    } finally {
      setIsRunning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full h-full flex flex-col bg-white">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-4 sm:px-6 py-4 text-white flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold">
            {isEditMode ? "Update your note" : "Create note"}
          </h2>
          <button onClick={onClose} className="text-white text-xl">
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 overflow-hidden flex-col lg:flex-row min-h-0"
        >
          {/* Mobile meta toggle */}
          <div className="lg:hidden px-3 pt-3 pb-2 border-b">
            <button
              type="button"
              onClick={() => setShowMobileMeta((prev) => !prev)}
              className="w-full px-4 py-2 rounded-xl border bg-white text-sm font-medium"
            >
              {showMobileMeta ? "Hide Details" : "Show Details"}
            </button>
          </div>

          {/* Left panel */}
          <div
            className={`
              w-full lg:max-w-sm lg:border-r shrink-0 overflow-y-auto
              ${showMobileMeta ? "block" : "hidden"}
              lg:block
            `}
          >
            <div className="p-4 sm:p-6 space-y-4 lg:space-y-6">
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
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>

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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_sensitive"
                  checked={formData.is_sensitive}
                  onChange={handleChange}
                />
                <label>Sensitive</label>
              </div>

              {/* Desktop only */}
              <div className="hidden lg:block">
                <label className="text-sm font-semibold">
                  Detected Language
                </label>
                <div className="mt-2 border rounded-xl px-3 py-2 bg-gray-50 text-sm">
                  {currentLanguage}
                </div>
              </div>

              {isProgrammingLanguage && (
                <div className="space-y-3 hidden md:block">
                  <button
                    type="button"
                    onClick={handleRunPython}
                    disabled={isRunning || !isPython}
                    className={`w-full px-4 py-2 rounded-xl text-white ${
                      isRunning || !isPython
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isRunning ? "Running..." : "Run Python"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowOutput((prev) => !prev)}
                    className="w-full px-4 py-2 rounded-xl border bg-white text-sm"
                    aria-label={showOutput ? "Hide output" : "Show output"}
                  >
                    {showOutput ? "Hide Output" : "Show Output"}
                  </button>

                  {!isPython && (
                    <p className="text-xs text-gray-500 mt-2">
                      Run is only enabled when the detected language is Python.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Editor panel */}
          <div className="flex-1 flex flex-col p-3 sm:p-6 gap-4 min-h-0">
            <div className="flex-1 flex flex-col min-h-0">
              <label className="text-sm font-semibold mb-2">Content</label>

              <div className="border rounded-xl overflow-hidden flex-1 min-h-0">
                <Editor
                  onMount={(editor) => {
                    editorRef.current = editor;
                  }}
                  height="100%"
                  language={currentLanguage}
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
                <p className="text-red-500 text-sm mt-2">{errors.content}</p>
              )}
            </div>

            {isProgrammingLanguage && showOutput && (
              <div className="h-48 flex-col hidden md:flex">
                <label className="text-sm font-semibold mb-2">Output</label>
                <textarea
                  value={output}
                  readOnly
                  className="w-full h-full border rounded-xl px-3 py-2 bg-gray-50 font-mono text-sm resize-none"
                  placeholder="Python output will appear here..."
                />
              </div>
            )}
          </div>
        </form>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 p-4 border-t bg-white">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border rounded-xl"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-xl"
          >
            {isLoading ? "Saving..." : isEditMode ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;