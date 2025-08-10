import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLogo from '../components/app/AppLogo';

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        name: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { signin, signup } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the redirect path from location state, default to home
    const from = location.state?.from?.pathname || '/';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                await signup({
                    email: formData.email,
                    username: formData.username,
                    password: formData.password,
                    name: formData.name,
                });
            } else {
                await signin({
                    username: formData.username,
                    password: formData.password,
                });
            }
            // Navigate to the intended page after successful auth
            navigate(from, { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError(null);
        setFormData({ email: '', username: '', password: '', name: '' });
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-8 sm:py-10 lg:py-12 min-[1920px]:py-16 min-[2560px]:py-20 px-3 xs:px-4 sm:px-6 lg:px-8">
            {/* Compact on normal / laptop screens, scales only after very large breakpoints */}
            <div
                className="w-full space-y-8 border-2 border-grey-200 rounded-lg bg-white/80 backdrop-blur shadow-md font-sans transition-all
                max-w-[94vw] xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-[44rem]
                min-[1920px]:max-w-[min(72vw,56rem)] min-[2300px]:max-w-[min(66vw,60rem)] min-[2560px]:max-w-[min(60vw,64rem)] min-[3200px]:max-w-[min(54vw,68rem)]
                p-5 sm:p-7 md:p-9 lg:p-10 min-[1920px]:p-12 min-[2560px]:p-14"
            >
                <div className="text-center mb-6 sm:mb-8">
                    <span
                        className="inline-flex pl-[4rem] items-center gap-2 font-bold text-gray-900 relative right-[1rem] leading-tight
                        text-xl sm:text-2xl md:text-3xl min-[1920px]:text-[2.4rem] min-[2560px]:text-[2.6rem] min-[3200px]:text-[2.8rem]"
                    >
                        <div className="absolute left-[-1rem] top-[-1rem] flex items-center justify-center p-1">
                            <AppLogo className="text-white fill-white w-full h-full" />
                        </div>
                        TuneForger
                    </span>
                </div>

                <div>
                    <h2
                        className="mt-4 sm:mt-6 text-center font-semibold text-gray-900 leading-snug
                        text-[clamp(1.4rem,2.2vw+0.6rem,2.5rem)] min-[1920px]:text-[clamp(2rem,1.2vw+1.3rem,3rem)] min-[2560px]:text-[clamp(2.2rem,1vw+1.5rem,3.1rem)]"
                    >
                        {isSignUp ? 'Create your account' : 'Sign in to your account'}
                    </h2>
                    <p className="mt-2 text-center text-xs sm:text-sm md:text-base text-gray-600 min-[1920px]:text-[1.05rem] min-[2560px]:text-[1.15rem]">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button onClick={toggleMode} className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none">
                            {isSignUp ? 'Sign in' : 'Sign up'}
                        </button>
                    </p>
                </div>

                <form className="mt-6 sm:mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        {isSignUp && (
                            <>
                                <div>
                                    <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 min-[1920px]:text-base">
                                        Full Name
                                    </label>
                                    <input id="name" name="name" type="text" required={isSignUp} value={formData.name} onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm sm:text-base"
                                        placeholder="Enter your full name" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 min-[1920px]:text-base">
                                        Email Address
                                    </label>
                                    <input id="email" name="email" type="email" required={isSignUp} value={formData.email} onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm sm:text-base"
                                        placeholder="Enter your email address" />
                                </div>
                            </>
                        )}
                        <div>
                            <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-gray-700 min-[1920px]:text-base">
                                Username
                            </label>
                            <input id="username" name="username" type="text" required value={formData.username} onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm sm:text-base"
                                placeholder="Enter your username" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 min-[1920px]:text-base">
                                Password
                            </label>
                            <input id="password" name="password" type="password" required value={formData.password} onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm sm:text-base"
                                placeholder="Enter your password" />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-xs sm:text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit" disabled={loading}
                            className="group relative w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent font-medium rounded-md text-white bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base md:text-lg min-[1920px]:text-[1.25rem] min-[2560px]:text-[1.35rem] transition-colors"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                isSignUp ? 'Sign up' : 'Sign in'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;