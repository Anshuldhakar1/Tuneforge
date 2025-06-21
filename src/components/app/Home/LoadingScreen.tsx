const LoadingScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="flex flex-col items-center space-y-4">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-green-200 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-green-700 font-medium">Loading your music experience...</p>
        </div>
    </div>
)

export default LoadingScreen