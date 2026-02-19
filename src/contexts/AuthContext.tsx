import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType {
    apiKey: string;
    setApiKey: (key: string) => void;
    isSetup: boolean;
    completeSetup: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [apiKey, setApiKeyState] = useState(() => localStorage.getItem("yt_api_key") || import.meta.env.VITE_YOUTUBE_API_KEY || "");
    const [isSetup, setIsSetup] = useState(() => !!(localStorage.getItem("yt_api_key") || import.meta.env.VITE_YOUTUBE_API_KEY));

    const setApiKey = (key: string) => {
        setApiKeyState(key);
    };

    const completeSetup = () => {
        if (apiKey.trim()) {
            setIsSetup(true);
            localStorage.setItem("yt_api_key", apiKey);
        }
    };

    return (
        <AuthContext.Provider value={{ apiKey, setApiKey, isSetup, completeSetup }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
};
