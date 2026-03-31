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
    <tr className="border-b border-slate-200 hover:bg-emerald-50 transition">
      <td className="px-6 py-4 truncate max-w-62.5">
        <div className="font-semibold text-slate-900">{note.description}</div>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 max-w-[24rem]">
        {note.is_sensitive && !showContent ? (
          <div className="flex items-center gap-2">
            <span className="italic text-slate-400 text-xs">Hidden content</span>
            <button
              onClick={() => setShowContent(true)}
              className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold"
            >
              Show
            </button>
          </div>
        ) : (
          <>
            <p className="truncate">{note.content}</p>
            {note.is_sensitive && showContent && (
              <button
                onClick={() => setShowContent(false)}
                className="mt-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold"
              >
                Hide
              </button>
            )}
          </>
        )}
      </td>
      <td className="px-5 py-4 text-sm text-slate-700">
        <div className="flex flex-wrap gap-2">
          {note.keyword?.map((kw, index) => (
            <span
              key={index}
              className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700"
            >
              {kw}
            </span>
          ))}
        </div>
      </td>
      <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
        {formatDate(note.dates)}
      </td>
      <td className="px-5 py-4 text-sm text-slate-700 space-x-2">
        <button
          onClick={() => onEdit(note)}
          className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(note)}
          className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-red-700 text-xs font-semibold hover:bg-red-100 transition"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default NoteCard;
