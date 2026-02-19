import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, User, Menu, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
    onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zen-surface/95 backdrop-blur supports-[backdrop-filter]:bg-zen-surface/60">
            <div className="flex h-14 items-center gap-4 px-4">
                {/* Left: Menu & Logo */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onMenuClick} className="shrink-0 text-zinc-400 hover:text-white">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Menu</span>
                    </Button>
                    <Link to="/" className="flex items-center gap-1 font-bold text-xl tracking-tight text-white select-none">
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
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <Input
                                type="search"
                                placeholder="Search"
                                className="w-full pl-10 bg-zinc-900 border-zinc-800 focus-visible:ring-zinc-700 rounded-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </form>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hidden sm:flex">
                        <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-zen-surface"></span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                        <User className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;
