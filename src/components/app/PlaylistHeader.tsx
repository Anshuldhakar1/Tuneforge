import { Headphones } from "lucide-react";

type PlaylistHeaderProps = {
  coverGradient?: string;
};

export function PlaylistHeader({ coverGradient }: PlaylistHeaderProps) {
  return (
    <div className="flex-shrink-0 flex items-center">
      <div
        className={`
          w-full md:w-[260px] min-w-[120px] max-w-[320px]
          aspect-square h-full rounded-2xl
          ${coverGradient ?? "bg-gradient-to-br from-[#31c266] to-[#1e8c4c]"}
          flex items-center justify-center shadow-lg
        `}
        style={{ height: "100%", minHeight: "160px" }}
      >
        <Headphones size={64} className="text-white opacity-90" />
      </div>
    </div>
  );
}