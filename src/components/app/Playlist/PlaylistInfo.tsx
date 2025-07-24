import { Edit2, Calendar, Clock, Check, X, Headphones } from "lucide-react";

type PlaylistInfoProps = {
  name: string;
  desc: string;
  editing: boolean;
  descDraft: string;
  setEditing: (v: boolean) => void;
  setDescDraft: (v: string) => void;
  setDesc: (v: string) => void;
  createdAt: string | number;
  duration: string;
  tracksCount: number;
  moods?: string[];
  firstFourTrackCovers?: Array<{ coverUrl: string }>;
};

export function PlaylistInfo({
  name,
  desc,
  editing,
  descDraft,
  setEditing,
  setDescDraft,
  setDesc,
  createdAt,
  duration,
  tracksCount,
  moods,
  firstFourTrackCovers = [],
}: PlaylistInfoProps) {

  // console.log(firstFourTrackCovers);

  // Helper function to format date safely
  const formatDate = (dateInput: string | number) => {
    try {
      let date: Date;
      
      if (typeof dateInput === 'number') {
        // Handle timestamp (could be in seconds or milliseconds)
        date = new Date(dateInput > 1000000000000 ? dateInput : dateInput * 1000);
      } else if (typeof dateInput === 'string') {
        // Handle string dates - try different formats
        if (dateInput.includes('/')) {
          // Handle formats like "25/06/25" or "06/25/2025"
          const parts = dateInput.split('/');
          if (parts.length === 3) {
            let [day, month, year] = parts;
            
            // Convert 2-digit year to 4-digit
            if (year.length === 2) {
              const currentYear = new Date().getFullYear();
              const currentCentury = Math.floor(currentYear / 100) * 100;
              year = String(currentCentury + parseInt(year));
            }
            
            // Create date in ISO format (YYYY-MM-DD)
            date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
          } else {
            date = new Date(dateInput);
          }
        } else {
          date = new Date(dateInput);
        }
      } else {
        date = new Date();
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="flex gap-8 items-center relative">
      {/* Cool Impactful Accent Design */}
      <div className="absolute top-[10%] h-[80%] w-[150%] left-[-3rem] z-[-1]">
        
        {/* Bold corner accents */}
        <div className="absolute top-[15%] left-[15%] w-4 h-4 bg-[#31c266]/70 transform rotate-45" />
        <div className="absolute bottom-[15%] right-[25%] w-3 h-3 bg-emerald-400/60 transform rotate-45" />
        
        {/* Sleek connecting lines */}
        <div className="absolute top-[30%] left-[30%] w-8 h-0.5 bg-[#31c266]/50 transform -rotate-45" />
        <div className="absolute bottom-[30%] right-[40%] w-6 h-0.5 bg-emerald-500/50 transform -rotate-45" />
      </div>

    
    
      {/* Large Headphone Icon */}
      {firstFourTrackCovers.length == 0 ? (
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#31c266] to-[#1e8c4c] flex items-center justify-center shadow-2xl border-2 border-white/20 backdrop-blur-sm relative overflow-hidden">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 animate-pulse" />

            {/* Floating music notes */}
            <div className="absolute top-2 right-2 text-white/20 text-sm animate-bounce" style={{ animationDelay: '0.3s' }}>♪</div>
            <div className="absolute bottom-3 left-3 text-white/15 text-xs animate-bounce" style={{ animationDelay: '0.8s' }}>♫</div>

            <Headphones size={48} className="text-white opacity-90 drop-shadow-lg relative z-10" />
          </div>
        </div>  
      ) :
        <div className="grid grid-cols-2 grid-rows-2 shadow-lg shadow-slate-600 w-[15rem] rounded-2xl overflow-hidden">
          {firstFourTrackCovers.map((cover, index) => (
            <div key={index} className="relative w-full  h-32 overflow-hidden">
              <img src={cover.coverUrl} alt={`Track Cover ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          ))}
        </div>
      }

      {/* Content */}
      <div className="flex-1">
        {/* Subtle Gradient Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 leading-tight break-words max-w-3xl">
          <span className="bg-gradient-to-r from-gray-700 via-[#31c266] to-emerald-600 dark:from-gray-300 dark:via-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent">
            {name}
          </span>
        </h1>
        
        {/* Creative Mood Visualization */}
        {moods && moods.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {moods.map((mood, index) => (
                <span
                  key={index}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors cursor-default"
                  style={{
                    borderLeft: `3px solid hsl(${(index * 360) / moods.length + 120}, 60%, 65%)`,
                    paddingLeft: '6px'
                  }}
                >
                  {mood}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-3 flex items-start gap-3">
          <span className="text-gray-700 dark:text-gray-200 font-bold mt-1">
            Description:
          </span>
          {!editing ? (
            <button
              className="p-2 rounded-lg hover:bg-[#eafaf2] dark:hover:bg-[#223c2e] transition-all duration-200 shadow-sm border border-[#31c266]/20 bg-white/50 dark:bg-gray-800/50"
              onClick={() => setEditing(true)}
              aria-label="Edit description"
            >
              <Edit2 size={18} className="text-[#31c266]" />
            </button>
          ) : null}
        </div>
        {!editing ? (
          <p className="text-gray-700 dark:text-gray-300 text-base mb-4 font-medium leading-relaxed">{desc}</p>
        ) : (
          <div className="mb-4">
            <textarea
              className="w-full min-h-[80px] p-4 rounded-xl border-2 border-[#31c266]/30 focus:ring-3 focus:ring-[#31c266]/40 focus:border-[#31c266] bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white transition-all duration-300 backdrop-blur-sm shadow-inner font-medium"
              value={descDraft}
              onChange={(e) => setDescDraft(e.target.value)}
              autoFocus
            />
            <div className="flex gap-3 mt-3">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-medium transition-all duration-200 shadow-sm border border-green-600"
                onClick={() => {
                  setDesc(descDraft);
                  setEditing(false);
                }}
              >
                <Check size={14} /> Save
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 shadow-sm border border-gray-300 dark:border-gray-600"
                onClick={() => {
                  setDescDraft(desc);
                  setEditing(false);
                }}
              >
                <X size={14} /> Cancel
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
          {/* Created Date */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-blue-200 dark:border-blue-800 shadow-sm bg-blue-50/50 dark:bg-blue-950/20">
            <Calendar size={16} className="text-blue-500" />
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {formatDate(createdAt)}
            </span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-green-200 dark:border-green-800 shadow-sm bg-green-50/50 dark:bg-green-950/20">
            <Clock size={16} className="text-green-500" />
            <span className="text-green-600 dark:text-green-400 font-medium">
              {duration}
            </span>
          </div>

          {/* Track Count */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-purple-200 dark:border-purple-800 shadow-sm bg-purple-50/50 dark:bg-purple-950/20">
            
            <span className="text-purple-600 dark:text-purple-400 font-medium">
              {tracksCount} tracks
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}