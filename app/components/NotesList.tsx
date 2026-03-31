"use client";

import React from "react";
import NoteCard from "./NoteCard";
import { INote } from "../lib/types";

interface NotesListProps {
  notes: INote[];
  isLoading: boolean;
  onEdit: (note: INote) => void;
  onDelete: (note: INote) => void;
}

const NotesList: React.FC<NotesListProps> = ({
  notes,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg
          className="animate-spin h-10 w-10 text-emerald-600 mb-4"
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
        <p className="text-slate-500 text-lg">Loading notes...</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">
          No notes found
        </h3>
        <p className="text-slate-500">
          Create your first note or adjust your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {notes.length}
            </span>{" "}
            note{notes.length !== 1 ? "s" : ""}
          </p>
          <p className="text-xs text-slate-400">
            Manage your notes in a polished table view.
          </p>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="grid gap-4 md:hidden">
        {notes.map((note) => (
          <div
            key={note._id}
            className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm overflow-hidden"
          >
            <div className="space-y-3">
              {/* Title + Content */}
              <div className="min-w-0 w-full">
                <h3 className="text-base font-semibold text-slate-900 truncate">
                  {note.description}
                </h3>

                {/* 3-line truncate (no plugin) */}
                <p
                  className="mt-2 text-sm text-slate-600 overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {note.content}
                </p>
              </div>

              {/* Keywords */}
              {note.keyword?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {note.keyword.map((kw, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500">
                <span>
                  {new Date(note.dates).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onEdit(note)}
                    className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-700 text-sm font-semibold hover:bg-emerald-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(note)}
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-red-700 text-sm font-semibold hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto rounded-[28px] border border-emerald-100 shadow-lg bg-white">
        <table className="w-full table-fixed border-collapse text-left">
          <thead className="bg-emerald-50">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 first:rounded-tl-[28px]">
                Description
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Content
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Keywords
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Date
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 last:rounded-tr-[28px]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotesList;