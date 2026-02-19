import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Layout component needs to be inside BrowserRouter for useNavigate to work
function AppLayout({ apiKey, setApiKey, isSetup, handleSetup }: any) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  if (!isSetup) {
    return (
      <div className="fixed inset-0 bg-zen-bg z-[60] flex flex-col items-center justify-center p-4">
        <div className="bg-zen-surface p-8 rounded-2xl w-full max-w-md text-center shadow-2xl border border-zinc-900 ring-1 ring-white/5">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome</h2>
          <p className="text-zinc-500 text-sm mb-6">Enter your YouTube Data API Key to continue</p>
          <Input
            className="w-full bg-black/30 border-zinc-800 text-white placeholder-zinc-600 focus-visible:ring-1 focus-visible:ring-white/20"
            type="text"
            placeholder="Paste API Key here"
            value={apiKey}
            onChange={(e: any) => setApiKey(e.target.value)}
          />
          <Button
            className="mt-6 w-full py-6 font-semibold rounded-xl text-md shadow-lg shadow-white/5"
            variant="secondary"
            onClick={handleSetup}
          >
            Start Watching
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zen-bg text-zen-text flex selection:bg-white/20">
      <Sidebar />

      <main className="flex-1 ml-16 w-[calc(100%-4rem)] transition-all duration-300">
        {/* Search Trigger */}
        <div
          className="fixed top-6 right-6 w-12 h-12 bg-zen-surface hover:bg-zinc-800 hover:scale-105 rounded-full flex items-center justify-center cursor-pointer transition-all z-40 shadow-xl border border-white/5 group"
          onClick={() => setIsSearchOpen(true)}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" fill="currentColor"><path d="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71 l5.59,5.59L20.87,20.17z M10,16c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S13.31,16,10,16z"></path></svg>
        </div>

        {/* Search Popup - Zen Mode */}
        {isSearchOpen && (
          <div
            className="fixed inset-0 bg-zen-bg/95 backdrop-blur-xl z-[100] flex items-center justify-center animate-in fade-in duration-200"
            onClick={() => setIsSearchOpen(false)}
          >
            <div className="w-full max-w-3xl px-6" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleSearchSubmit}>
                <Input
                  ref={searchInputRef}
                  type="text"
                  className="w-full bg-transparent border-0 border-b-2 border-zinc-800 rounded-none px-0 text-4xl md:text-5xl lg:text-6xl text-center text-white font-bold placeholder-zinc-800 focus-visible:ring-0 focus-visible:border-white transition-all pb-4 h-auto"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Home apiKey={apiKey} />} />
          <Route path="/trending" element={<Home apiKey={apiKey} isTrending={true} />} />
          <Route path="/watch/:videoId" element={<Watch apiKey={apiKey} />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("yt_api_key") || import.meta.env.VITE_YOUTUBE_API_KEY || "");
  const [isSetup, setIsSetup] = useState(() => !!(localStorage.getItem("yt_api_key") || import.meta.env.VITE_YOUTUBE_API_KEY));

  const handleSetup = () => {
    if (apiKey.trim()) {
      setIsSetup(true);
      localStorage.setItem("yt_api_key", apiKey);
    }
  };

  return (
    <BrowserRouter>
      <AppLayout
        apiKey={apiKey}
        setApiKey={setApiKey}
        isSetup={isSetup}
        handleSetup={handleSetup}
      />
    </BrowserRouter>
  );
}

export default App;
