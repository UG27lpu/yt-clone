import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SidebarProvider, useSidebar } from "./contexts/SidebarContext";

// Layout component using Context hooks
function AppLayout() {
  const { isSidebarOpen } = useSidebar();
  const { apiKey, setApiKey, isSetup, completeSetup } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: "Welcome to ZenTube 🎬",
        description: "Enjoy distraction-free viewing.",
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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
            onClick={completeSetup}
          >
            Start Watching
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zen-bg text-zen-text font-sans selection:bg-white/20">
      <Header />

      <div className="flex">
        <SidebarWrapper />

        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-60' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trending" element={<Home isTrending={true} />} />
            <Route path="/explore/:categoryId" element={<Home />} />
            <Route path="/feed/history" element={<Home isHistory={true} />} />
            <Route path="/watch/:videoId" element={<Watch />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// Separate Sidebar wrapper to avoid conditional rendering issues if any
const SidebarWrapper = () => {
  const { isSidebarOpen } = useSidebar();
  if (!isSidebarOpen) return null;
  return <Sidebar />;
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <SidebarProvider>
          <BrowserRouter>
            <AppLayout />
            <Toaster />
          </BrowserRouter>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
