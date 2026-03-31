"use client";

import React, { useState } from "react";
import { INote } from "../lib/types";

interface NoteCardProps {
  note: INote;
  onEdit: (note: INote) => void;
  onDelete: (note: INote) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  const [showContent, setShowContent] = useState(!note.is_sensitive);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                {note.notes_id}
              </span>
              {note.is_sensitive && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Sensitive
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              {note.description}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          {note.is_sensitive && !showContent ? (
            <div className="flex items-center gap-2">
              <p className="text-gray-400 italic text-sm">
                Content is hidden (sensitive)
              </p>
              <button
                onClick={() => setShowContent(true)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
              >
                Show
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">
                {note.content.length > 200
                  ? `${note.content.substring(0, 200)}...`
                  : note.content}
              </p>
              {note.is_sensitive && showContent && (
                <button
                  onClick={() => setShowContent(false)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium underline mt-1"
                >
                  Hide
                </button>
              )}
            </div>
          )}
        </div>

        {/* Keywords */}
        {note.keyword && note.keyword.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {note.keyword.map((kw, index) => (
              <span
                key={index}
                className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-100"
              >
                {kw}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            📅 {formatDate(note.dates)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(note)}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => onDelete(note)}
              className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded-lg transition font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;