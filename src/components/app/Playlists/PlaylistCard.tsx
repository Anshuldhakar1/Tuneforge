import { Heart, Trash2 } from "lucide-react";
import clsx from "clsx";
import { Link } from "react-router-dom";

type Playlist = {
  _id: string;
  name: string;
  description: string;
  createdAt: number;
  spotifyUrl?: string;
  color: string;
};

type PlaylistCardProps = {
  playlist: Playlist;
  liked: boolean;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
};

export function PlaylistCard({
  playlist,
  liked,
  onLike,
  onDelete
}: PlaylistCardProps) {
  return (
    <Link
      to={"/playlist/" + playlist._id}
      key={playlist._id}
      className="rounded-xl flex-1 max-w-[20vw] shadow z-10 cursor-pointer border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col bg-white dark:bg-gray-900
        transition-all duration-200 ease-in hover:scale-[1.015] hover:shadow-lg"
      style={{ minHeight: 300 }}
    >
      <div
        className={clsx(
          "relative flex-1 min-h-[64px] max-h-[180px] flex items-start justify-end p-3",
          "bg-gradient-to-br",
          playlist.color
        )}
      >
        <button
          aria-label="Like playlist"
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            onLike(playlist._id);
          }}
          className="absolute top-3 right-3 z-12 p-1 rounded-full bg-white/80 hover:bg-white transition-all duration-200 ease-in-out"
        >
          <Heart
            size={18}
            fill={liked ? "#ef4444" : "none"}
            color="#ef4444"
            className="transition-all duration-200 ease-in"
          />
        </button>
        {playlist.spotifyUrl && (
          <a
            href={playlist.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 left-3 p-1.5 bg-white rounded-lg shadow transition-all duration-200 ease-in-out hover:scale-105"
            title="Open in Spotify"
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="12" fill="#31c266" />
              <path
                d="M17.5 16.1a.75.75 0 0 1-1.03.25c-2.8-1.7-6.34-2.09-10.52-1.14a.75.75 0 1 1-.32-1.47c4.52-1 8.39-.57 11.48 1.28a.75.75 0 0 1 .25 1.08zm1.47-2.65a.94.94 0 0 1-1.29.32c-3.2-1.97-8.09-2.54-11.88-1.38a.94.94 0 1 1-.54-1.8c4.22-1.28 9.54-.65 13.18 1.56.45.28.59.88.32 1.3zm.13-2.8C15.2 8.5 8.8 8.3 6.13 9.09a1.13 1.13 0 1 1-.65-2.17c3.1-.93 10.2-.7 13.1 1.73a1.13 1.13 0 0 1-1.18 1.91z"
                fill="#fff"
              />
            </svg>
          </a>
        )}
      </div>
      <div className="bg-white dark:bg-gray-900 p-3 flex flex-col flex-shrink-0">
        <div className="flex items-center justify-between mb-0.5">
          <h3 className="text-base font-medium text-gray-900 dark:text-white">
            {playlist.name}
          </h3>
          <button
            aria-label="Delete playlist"
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              onDelete(playlist._id);
            }}
            className="p-1 rounded-full transition-all duration-200 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Trash2 size={16} color="#ef4444" />
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
          {playlist.description}
        </p>
        <small className="text-xs text-gray-400">
          {new Date(playlist.createdAt).toLocaleDateString()}
        </small>
      </div>
    </Link>
  );
}