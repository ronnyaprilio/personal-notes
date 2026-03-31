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
          className="animate-spin h-10 w-10 text-blue-600 mb-4"
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
        <p className="text-gray-500 text-lg">Loading notes...</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No notes found
        </h3>
        <p className="text-gray-500">
          Create your first note or adjust your search filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-700">{notes.length}</span>{" "}
          note{notes.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default NotesList;