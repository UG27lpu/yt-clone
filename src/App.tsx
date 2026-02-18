import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";

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
      <div className="setup-overlay">
        <div className="setup-box">
          <h2 style={{color: 'white', marginBottom: '10px'}}>Welcome</h2>
          <p style={{color: '#aaa', fontSize: '14px'}}>Enter your YouTube Data API Key to continue</p>
          <input
            className="setup-input"
            type="text"
            placeholder="Paste API Key here"
            value={apiKey}
            onChange={(e: any) => setApiKey(e.target.value)}
          />
          <button className="setup-btn" onClick={handleSetup}>
            Start Watching
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container with-sidebar">
      <Sidebar />
      
      <main className="main-content">
        {/* Search Trigger */}
        <div className="search-trigger" onClick={() => setIsSearchOpen(true)}>
          <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style={{ pointerEvents: 'none', display: 'block', width: '24px', height: '24px', fill: 'white' }}><g><path d="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71 l5.59,5.59L20.87,20.17z M10,16c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S13.31,16,10,16z"></path></g></svg>
        </div>

        {/* Search Popup */}
        {isSearchOpen && (
          <div className="search-overlay" onClick={() => setIsSearchOpen(false)}>
            <div className="search-box" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleSearchSubmit}>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="search-input"
                  placeholder="Search"
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
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("yt_api_key") || import.meta.env.VITE_YOUTUBE_API_KEY || "");
  const [isSetup, setIsSetup] = useState(false);

  useEffect(() => {
    if (apiKey) {
      setIsSetup(true);
    }
  }, []);

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
