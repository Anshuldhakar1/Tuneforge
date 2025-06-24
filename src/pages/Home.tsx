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
import ThreeColumnLayout from "../components/app/Home/ThreeColumnLayout";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface HomeProps {
  user: {
    username: string
    email: string
    userId: string
  } | null
  loading: boolean
}

const Home = ({ user, loading }: HomeProps) => {
  const [description, setDescription] = useState("")
  const [playlistName, setPlaylistName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [focusedInput, setFocusedInput] = useState<string | null>(null)

  const generate = useAction(api.gemini.aiGenerate);

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
          description: `Generated ${result.length} tracks. Check your playlists for the new tracks.`,
        });
    } catch (error) {
      console.error("Error in generation: ", error);
    } finally {
      setIsGenerating(false);
    }
  }

  const handleCuratedClick = (playlist: CuratedPlaylist) => {
    setDescription(playlist.title)
    setPlaylistName("")
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen relative overflow-hidden ">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <HeaderSection />
        {user && ( <span></span> )}
        <ThreeColumnLayout
          description={description}
          setDescription={setDescription}
          playlistName={playlistName}
          setPlaylistName={setPlaylistName}
          isGenerating={isGenerating}
          handleGenerate={handleGenerate}
          focusedInput={focusedInput}
          setFocusedInput={setFocusedInput}
        />
        <CuratedPlaylistsSection
          curatedPlaylists={curatedPlaylists}
          handleCuratedClick={handleCuratedClick}
        />

        
      </div>
    </div>
  )
}

export default Home