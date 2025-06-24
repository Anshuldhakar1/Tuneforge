import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type User = {
    userId: string;
    email: string;
    username: string;
    expiresAt: number;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    signup: (args: { email: string; username: string; password: string; name: string }) => Promise<void>;
    signin: (args: { username: string; password: string }) => Promise<void>;
    signout: () => void;
    error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("session_token"));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const signupAction = useAction(api.auth.signup);
    const signinAction = useAction(api.auth.signin);

    // Validate session on load or token change
    const sessionData = useQuery(
        api.auth.validateSession,
        token ? { token } : "skip"
    );

    // Handle session validation results
    useEffect(() => {
        // If we don't have a token, we're not loading and not authenticated
        if (!token) {
            setUser(null);
            setError(null);
            setLoading(false);
            return;
        }

        // If query is still loading, keep loading state
        if (sessionData === undefined) {
            return; // still loading
        }

        // Query completed - handle results
        if (sessionData === null) {
            // Session is invalid or expired
            setUser(null);
            setToken(null);
            setError(null);
            setLoading(false);
            localStorage.removeItem("session_token");
        } else {
            // Session is valid
            setUser(sessionData);
            setError(null);
            setLoading(false);
        }
    }, [sessionData, token]);

    // Auto-logout after session expiry
    useEffect(() => {
        if (user && user.expiresAt) {
            const expiresIn = user.expiresAt - Date.now();
            if (expiresIn > 0) {
                const timer = setTimeout(() => {
                    signout();
                }, expiresIn);
                return () => clearTimeout(timer);
            } else {
                signout();
            }
        }
    }, [user]);

    const signup = async (args: { email: string; username: string; password: string; name: string }) => {
        setLoading(true);
        setError(null);
        try {
            const res = await signupAction(args);
            setToken(res.token);
            localStorage.setItem("session_token", res.token);
            // Don't setLoading(false) here, let useEffect handle it after sessionData updates
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Signup failed');
            setLoading(false);
            throw err;
        }
    };

    const signin = async (args: { username: string; password: string }) => {
        setLoading(true);
        setError(null);
        try {
            const res = await signinAction(args);
            setToken(res.token);
            console.log("Signin successful, set the session token");
            localStorage.setItem("session_token", res.token);
            // Don't setLoading(false) here, let useEffect handle it after sessionData updates
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Signin failed');
            setLoading(false);
            throw err;
        }
    };

    const signout = () => {
        setUser(null);
        setToken(null);
        setError(null);
        setLoading(false); // Ensure loading is false when signing out
        console.log("Signing out, removing session token");
        localStorage.removeItem("session_token");
    };

    return (
        <AuthContext.Provider value={{ user, loading, signup, signin, signout, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}