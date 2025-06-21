interface HomeProps {
    user: {
        username: string;
        email: string;
        userId: string;
    } | null;
    loading: boolean;
    signout: () => void;
}

const Home = (
    { user, loading, signout }: HomeProps
) => {

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className=" py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="shadow rounded-lg p-6 bg-white/80 backdrop-blur">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Welcome to Tuneforge</h1>
                            <p className="text-gray-600 mt-2">Hello, {user?.username}!</p>
                        </div>
                        <button
                            onClick={signout}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Sign Out
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gray-50/80 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-2">User Info</h3>
                            <p className="text-sm text-gray-600">Email: {user?.email}</p>
                            <p className="text-sm text-gray-600">Username: {user?.username}</p>
                            <p className="text-sm text-gray-600">User ID: {user?.userId}</p>
                        </div>

                        <div className="bg-blue-50/80 p-4 rounded-lg">
                            <h3 className="font-semibold text-blue-900 mb-2">Session Info</h3>
                            <p className="text-sm text-blue-600">Session expires after 3 hours of inactivity</p>
                            <p className="text-sm text-blue-600">Auto-logout is enabled</p>
                        </div>

                        <div className="bg-green-50/80 p-4 rounded-lg">
                            <h3 className="font-semibold text-green-900 mb-2">Features</h3>
                            <p className="text-sm text-green-600">✓ Protected routes</p>
                            <p className="text-sm text-green-600">✓ Session management</p>
                            <p className="text-sm text-green-600">✓ Secure authentication</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;