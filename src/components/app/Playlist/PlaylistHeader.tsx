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
          flex items-center justify-center shadow-2xl
          transform hover:-translate-y-1 hover:scale-105 transition-all duration-300
          border-2 border-white/20 backdrop-blur-sm
          relative overflow-hidden
        `}
        style={{ height: "100%", minHeight: "160px" }}
      >
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 animate-pulse" />
        
        {/* Floating music notes */}
        <div className="absolute top-4 right-4 text-white/20 text-xl animate-bounce" style={{ animationDelay: '0.3s' }}>♪</div>
        <div className="absolute bottom-6 left-6 text-white/15 text-lg animate-bounce" style={{ animationDelay: '0.8s' }}>♫</div>
        
        <Headphones size={64} className="text-white opacity-90 drop-shadow-lg relative z-10 transform hover:scale-110 transition-transform duration-200" />
      </div>
    </div>
  );
}