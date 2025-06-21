import { Edit2, Calendar, Clock, Check, X } from "lucide-react";
import React from "react";

type PlaylistInfoProps = {
  name: string;
  generatedFrom: string;
  desc: string;
  editing: boolean;
  descDraft: string;
  setEditing: (v: boolean) => void;
  setDescDraft: (v: string) => void;
  setDesc: (v: string) => void;
  createdAt: string | number;
  duration: string;
  tracksCount: number;
};

export function PlaylistInfo({
  name,
  generatedFrom,
  desc,
  editing,
  descDraft,
  setEditing,
  setDescDraft,
  setDesc,
  createdAt,
  duration,
  tracksCount,
}: PlaylistInfoProps) {
  return (
    <div className="flex-1 flex flex-col justify-center bg-white rounded-xl p-6 min-h-[260px]">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2 leading-tight">
        {name}
      </h1>
      <div className="mb-2">
        <span className="text-gray-500 text-base font-medium">Generated from:</span>
        <span className="italic text-gray-600 dark:text-gray-300 ml-2">
          "{generatedFrom}"
        </span>
      </div>
      <div className="mb-2 flex items-start gap-2">
        <span className="text-gray-700 dark:text-gray-200 font-medium mt-1">
          Description:
        </span>
        {!editing ? (
          <button
            className="p-1 rounded hover:bg-[#eafaf2] dark:hover:bg-[#223c2e] transition"
            onClick={() => setEditing(true)}
            aria-label="Edit description"
          >
            <Edit2 size={16} className="text-[#31c266]" />
          </button>
        ) : null}
      </div>
      {!editing ? (
        <p className="text-gray-700 dark:text-gray-300 text-base mb-4">{desc}</p>
      ) : (
        <div className="mb-4">
          <textarea
            className="w-full min-h-[80px] p-2 rounded border border-[#31c266]/30 focus:ring-2 focus:ring-[#31c266] bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition"
            value={descDraft}
            onChange={(e) => setDescDraft(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#31c266] text-white font-medium hover:bg-[#259a4d] transition"
              onClick={() => {
                setDesc(descDraft);
                setEditing(false);
              }}
            >
              <Check size={16} /> Save
            </button>
            <button
              className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              onClick={() => {
                setDescDraft(desc);
                setEditing(false);
              }}
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-4">
        <span className="flex items-center gap-1">
          <Calendar size={12} /> Created {new Date(createdAt).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} /> {duration}
        </span>
        <span>{tracksCount} tracks</span>
      </div>
    </div>
  );
}