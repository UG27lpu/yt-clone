import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, User, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import { useSidebar } from "@/contexts/SidebarContext";

const Header = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { toggleSidebar } = useSidebar();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zen-surface/95 backdrop-blur supports-[backdrop-filter]:bg-zen-surface/60">
            <div className="flex h-14 items-center gap-4 px-4">
                {/* Left: Menu & Logo */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="shrink-0 text-zen-text/70 hover:text-zen-text hover:bg-zen-hover">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Menu</span>
                    </Button>
                    <Link to="/" className="flex items-center gap-1 font-bold text-xl tracking-tight text-zen-text select-none">
                        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-red-600 shadow-lg shadow-red-600/20">
                            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[10px] border-l-white border-b-[5px] border-b-transparent ml-1"></div>
                        </div>
                        <span>ZenTube</span>
                    </Link>
                </div>

                {/* Center: Search */}
                <div className="flex-1 flex justify-center max-w-2xl mx-auto">
                    <form onSubmit={handleSearch} className="w-full relative flex items-center">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zen-subtext" />
                            <Input
                                type="search"
                                placeholder="Search"
                                className="w-full pl-10 bg-zen-surface border-border focus-visible:ring-ring rounded-full text-zen-text placeholder:text-zen-subtext"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </form>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="text-zen-text/70 hover:text-zen-text hover:bg-zen-hover"
                        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {theme === "dark" ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-zen-text/70 hover:text-zen-text hover:bg-zen-hover">
                        <User className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;
