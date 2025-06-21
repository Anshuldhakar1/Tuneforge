import { Heart, Share2, Download } from "lucide-react";
import clsx from "clsx";

type PlaylistActionsProps = {
  liked: boolean;
  setLiked: (fn: (l: boolean) => boolean) => void;
};

export function PlaylistActions({ liked, setLiked }: PlaylistActionsProps) {
  return (
    <div className="flex gap-3 ml-4">
      <button
        className={clsx(
          "w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 hover:bg-[#eafaf2] dark:hover:bg-[#223c2e] transition",
          liked && "ring-2 ring-[#ef4444]/40 border-none"
        )}
        onClick={() => setLiked((l) => !l)}
        aria-label="Like playlist"
      >
        <Heart
          size={18}
          fill={liked ? "#ef4444" : "none"}
          color={liked ? "#ef4444" : "#31c266"}
          className="transition"
        />
      </button>
      <button
        className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 hover:bg-[#eafaf2] dark:hover:bg-[#223c2e] transition"
        aria-label="Share playlist"
      >
        <Share2 size={16} className="text-[#31c266]" />
      </button>
      <button
        className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 hover:bg-[#eafaf2] dark:hover:bg-[#223c2e] transition"
        aria-label="Download playlist"
      >
        <Download size={16} className="text-[#31c266]" />
      </button>
    </div>
  );
}