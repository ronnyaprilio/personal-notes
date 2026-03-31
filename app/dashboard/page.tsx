"use client";

import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../components/SearchBar";
import NotesList from "../components/NotesList";
import NoteModal from "../components/NoteModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { INote, INoteForm } from "../lib/types";

export default function Home() {
  const [notes, setNotes] = useState<INote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<INote | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<INote | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDateFrom, setSearchDateFrom] = useState("");
  const [searchDateTo, setSearchDateTo] = useState("");

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("query", searchQuery);
      if (searchDateFrom) params.set("dateFrom", searchDateFrom);
      if (searchDateTo) params.set("dateTo", searchDateTo);

      const response = await fetch(`/dashboard/api/notes?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setNotes(data.data);
      } else {
        showToast(data.error || "Failed to fetch notes", "error");
      }
    } catch (error) {
      showToast("Failed to fetch notes. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, searchDateFrom, searchDateTo]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSearch = (query: string, dateFrom: string, dateTo: string) => {
    setSearchQuery(query);
    setSearchDateFrom(dateFrom);
    setSearchDateTo(dateTo);
  };

  const handleCreateNew = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const handleEdit = (note: INote) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (note: INote) => {
    setDeleteTarget(note);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (formData: INoteForm) => {
    setIsSubmitting(true);
    try {
      const url = selectedNote
        ? `/dashboard/api/notes/${selectedNote._id}`
        : "/dashboard/api/notes";
      const method = selectedNote ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showToast(
          selectedNote
            ? "Note updated successfully!"
            : "Note created successfully!",
          "success"
        );
        setIsModalOpen(false);
        setSelectedNote(null);
        fetchNotes();
      } else {
        showToast(data.error || "Operation failed", "error");
      }
    } catch (error) {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/dashboard/api/notes/${deleteTarget._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        showToast("Note deleted successfully!", "success");
        setIsDeleteModalOpen(false);
        setDeleteTarget(null);
        fetchNotes();
      } else {
        showToast(data.error || "Failed to delete note", "error");
      }
    } catch (error) {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📒</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Personal Notes
              </h1>
              <p className="text-sm text-gray-500">
                Manage your notes securely
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar onSearch={handleSearch} onCreateNew={handleCreateNew} />
        <NotesList
          notes={notes}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </main>

      {/* Modals */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNote(null);
        }}
        onSubmit={handleSubmit}
        note={selectedNote}
        isLoading={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        note={deleteTarget}
        isLoading={isSubmitting}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all transform animate-slide-up ${
            toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
// import { auth } from "@/auth"
// import { redirect } from "next/navigation"
// import LogoutButton from "../components/LogoutButton"

// export default async function Dashboard() {
//   const session = await auth()

//   if (!session) {
//     redirect("/")
//   }

//   return (
//     <div>
//       <h1>Welcome {session.user?.name}</h1>
//       <LogoutButton />
//     </div>
//   )
// }