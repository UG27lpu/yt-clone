import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Layout component needs to be inside BrowserRouter for useNavigate to work
function AppLayout({ apiKey, setApiKey, isSetup, handleSetup }: any) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!isSetup) {
    return (
      <div className="fixed inset-0 bg-zen-bg z-[60] flex flex-col items-center justify-center p-4">
        <div className="bg-zen-surface p-8 rounded-2xl w-full max-w-md text-center shadow-2xl border border-zinc-900 ring-1 ring-white/5">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to ZenTube</h2>
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
    <div className="min-h-screen bg-zen-bg text-zen-text font-sans selection:bg-white/20">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex">
        {isSidebarOpen && <Sidebar />}

        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-60' : ''}`}>
          <Routes>
            <Route path="/" element={<Home apiKey={apiKey} />} />
            <Route path="/trending" element={<Home apiKey={apiKey} isTrending={true} />} />
            <Route path="/explore/:categoryId" element={<Home apiKey={apiKey} />} />
            <Route path="/feed/history" element={<Home apiKey={apiKey} isHistory={true} />} />
            <Route path="/watch/:videoId" element={<Watch apiKey={apiKey} />} />
          </Routes>
        </main>
      </div>
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
