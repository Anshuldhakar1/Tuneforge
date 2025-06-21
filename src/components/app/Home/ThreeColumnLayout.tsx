import ProTipsCard from "./ProTipsCard"
import PlaylistForm from "./PlaylistForm"
import MusicDNA from "./MusicDNA"

interface ThreeColumnLayoutProps {
    description: string
    setDescription: (desc: string) => void
    playlistName: string
    setPlaylistName: (name: string) => void
    isGenerating: boolean
    handleGenerate: () => void
    focusedInput: string | null
    setFocusedInput: (input: string | null) => void
}

const ThreeColumnLayout = ({
    description,
    setDescription,
    playlistName,
    setPlaylistName,
    isGenerating,
    handleGenerate,
    setFocusedInput,
}: ThreeColumnLayoutProps) => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
            <ProTipsCard />
        </div>
        <div className="lg:col-span-6">
            <PlaylistForm
                description={description}
                setDescription={setDescription}
                playlistName={playlistName}
                setPlaylistName={setPlaylistName}
                isGenerating={isGenerating}
                handleGenerate={handleGenerate}
                setFocusedInput={setFocusedInput}
            />
        </div>
        <div className="lg:col-span-3">
            <MusicDNA />
        </div>
    </div>
)

export default ThreeColumnLayout