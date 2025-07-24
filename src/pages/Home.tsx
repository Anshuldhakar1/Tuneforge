import { useState } from "react"
import {
  Zap,
  Code,
  Plane,
  Heart,
  Headphones,
  Coffee,
  Sun,
  Sparkles,
  Volume2,
} from "lucide-react";

import type { CuratedPlaylist } from "../components/app/Home/CuratedPlaylistCard";
import CuratedPlaylistsSection from "../components/app/Home/CuratedPlaylistsSection";
import HeaderSection from "../components/app/Home/HeaderSection";
import LoadingScreen from "../components/app/Home/LoadingScreen";
import HomeMidSection from "../components/app/Home/HomeMidSection";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface HomeProps {
  user: {
    username: string
    email: string
    userId: string
  } | null
  loading: boolean
  isSpotifyConnected: boolean
}

const Home = ({ user, loading, isSpotifyConnected }: HomeProps) => {
  const [description, setDescription] = useState("")
  const [playlistName, setPlaylistName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [focusedInput, setFocusedInput] = useState<string | null>(null)

  // console.log(user);

  const generate = useAction(api.gemini.aiGenerate);
  const navigate = useNavigate();

  const curatedPlaylists: CuratedPlaylist[] = [
    {
      icon: <Zap className="w-4 h-4" />,
      category: "Fitness",
      title: "High-energy workout anthems with heavy bass drops",
      color: "text-orange-600",
      bg: "bg-orange-50",
      hover: "hover:bg-orange-100",
    },
    {
      icon: <Code className="w-4 h-4" />,
      category: "Study",
      title: "Lo-fi hip hop and ambient soundscapes for focus",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      hover: "hover:bg-indigo-100",
    },
    {
      icon: <Plane className="w-4 h-4" />,
      category: "Travel",
      title: "Classic rock road trip essentials with epic solos",
      color: "text-blue-600",
      bg: "bg-blue-50",
      hover: "hover:bg-blue-100",
    },
    {
      icon: <Heart className="w-4 h-4" />,
      category: "Romance",
      title: "Intimate acoustic love songs and soulful R&B",
      color: "text-rose-600",
      bg: "bg-rose-50",
      hover: "hover:bg-rose-100",
    },
    {
      icon: <Headphones className="w-4 h-4" />,
      category: "Tech",
      title: "Dark synthwave and cyberpunk electronic beats",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      hover: "hover:bg-emerald-100",
    },
    {
      icon: <Coffee className="w-4 h-4" />,
      category: "Jazz",
      title: "Smooth jazz standards and contemporary fusion",
      color: "text-amber-600",
      bg: "bg-amber-50",
      hover: "hover:bg-amber-100",
    },
    {
      icon: <Sun className="w-4 h-4" />,
      category: "Weekend",
      title: "Uplifting indie pop for sunny adventures",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      hover: "hover:bg-yellow-100",
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      category: "Party",
      title: "Nostalgic 2000s hits and throwback vibes",
      color: "text-violet-600",
      bg: "bg-violet-50",
      hover: "hover:bg-violet-100",
    },
    {
      icon: <Volume2 className="w-4 h-4" />,
      category: "Wellness",
      title: "Meditative world music and nature sounds",
      color: "text-green-600",
      bg: "bg-green-50",
      hover: "hover:bg-green-100",
    },
  ]

  const handleGenerate = async () => {
    if (!description.trim()) return
    setIsGenerating(true)
    
    const sessionToken = localStorage.getItem("session_token");
    if (!sessionToken) {  
      console.error("No session token found");
      setIsGenerating(false);
      return;
    }

    try {
      const result = await generate({ prompt: description, playlistName: playlistName, token: sessionToken });
      console.log("AI generation result: ", result);
      toast
        .success("Playlist generated successfully!", {
          description: "Your playlist has been created. Check your playlists for the new tracks.",
        });
      
      // navigate to your playlists when generation is complete
      setTimeout(() => {
        navigate("/playlists");
      }, 2000);
      
    } catch (error) {
      console.error("Error in generation: ", error);
    } finally {
      setIsGenerating(false);
    }
  }

  const handleCuratedClick = (playlist: CuratedPlaylist) => {
    setDescription(playlist.title)
    setPlaylistName("")
    
    // Smooth scroll to the playlist form
    setTimeout(() => {
      // Try multiple selectors to find the form
      const playlistForm = document.querySelector('form');
      
      if (playlistForm) {
        playlistForm.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      } else {
        // Fallback: scroll to a reasonable position
        window.scrollTo({ 
          top: window.innerHeight * 0.3, 
          behavior: 'smooth' 
        });
      }
    }, 100);
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-2 pt-2 pb-8">
        {/* Enhanced container with new styling */}
        <main className="w-full mx-auto p-8 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-[#31c266]/3 via-transparent to-[#31c266]/5" />
            <div className="absolute top-8 right-12 w-4 h-4 bg-[#31c266]/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-20 right-20 w-2 h-2 bg-[#31c266]/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-16 left-12 w-3 h-3 bg-[#31c266]/20 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
            <div className="absolute bottom-32 left-20 w-1 h-1 bg-[#31c266]/40 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
          </div>

          {/* Enhanced SVG background */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-60"
            style={{ zIndex: 0 }}
            width="100%"
            height="100%"
            viewBox="0 0 1440 900"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="homeWaveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#31c266" stopOpacity="0.08" />
                <stop offset="1" stopColor="#31c266" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 600 Q 360 500 720 600 T 1440 600 V900 H0 Z"
              fill="url(#homeWaveGradient)"
            />
            <path
              d="M0 500 Q 360 400 720 500 T 1440 500 V900 H0 Z"
              fill="url(#homeWaveGradient)"
              opacity="0.6"
            />
          </svg>

          <div className="relative z-10">
            <HeaderSection />
            <HomeMidSection
              description={description}
              setDescription={setDescription}
              playlistName={playlistName}
              setPlaylistName={setPlaylistName}
              isGenerating={isGenerating}
              handleGenerate={handleGenerate}
              focusedInput={focusedInput}
              setFocusedInput={setFocusedInput}
              isSpotifyConnected={isSpotifyConnected}
            />
            
            {/* Enhanced curated playlists section */}
            <div className="mt-16 relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#31c266]/50 to-transparent rounded-full" />
              <CuratedPlaylistsSection
                curatedPlaylists={curatedPlaylists}
                handleCuratedClick={handleCuratedClick}
              />
            </div>
          </div>

          {/* Bottom accent line only */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#31c266]/30 to-transparent rounded-b-3xl" />
        </main>
      </div>
    </div>
  )
}

export default Home