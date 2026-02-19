import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Home, Flame, Clock, TrendingUp, PlaySquare, Gamepad2, Newspaper, Trophy, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const Sidebar = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const currentOrder = searchParams.get("order");
  const currentPath = location.pathname;

  const isActive = (path: string, order?: string) => {
    if (order) return currentOrder === order;
    return currentPath === path && !currentOrder;
  };

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-60 border-r border-zinc-800 bg-zen-surface/50 hidden md:block z-40">
      <ScrollArea className="h-full py-2">
        <div className="space-y-4 py-2">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-zinc-500 uppercase">
              Discover
            </h2>
            <div className="space-y-1">
              <SidebarItem
                to="/"
                icon={<Home className="mr-2 h-4 w-4" />}
                label="Home"
                active={isActive("/")}
              />
              <SidebarItem
                to="/trending"
                icon={<Flame className="mr-2 h-4 w-4" />}
                label="Trending"
                active={isActive("/trending")}
              />
              <SidebarItem
                to="/?order=date"
                icon={<Clock className="mr-2 h-4 w-4" />}
                label="Newest"
                active={isActive("/", "date")}
              />
              <SidebarItem
                to="/?order=viewCount"
                icon={<TrendingUp className="mr-2 h-4 w-4" />}
                label="Popular"
                active={isActive("/", "viewCount")}
              />
            </div>
          </div>

          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-zinc-500 uppercase">
              Library
            </h2>
            <div className="space-y-1">
              <SidebarItem
                to="/feed/history"
                icon={<Clock className="mr-2 h-4 w-4" />}
                label="History"
                active={isActive("/feed/history")}
              />
              <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800">
                <PlaySquare className="mr-2 h-4 w-4" />
                Library
              </Button>
            </div>
          </div>

          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-zinc-500 uppercase">
              Explore
            </h2>
            <div className="space-y-1">
              <SidebarItem
                to="/explore/20"
                icon={<Gamepad2 className="mr-2 h-4 w-4" />}
                label="Gaming"
                active={isActive("/explore/20")}
              />
              <SidebarItem
                to="/explore/25"
                icon={<Newspaper className="mr-2 h-4 w-4" />}
                label="News"
                active={isActive("/explore/25")}
              />
              <SidebarItem
                to="/explore/17"
                icon={<Trophy className="mr-2 h-4 w-4" />}
                label="Sports"
                active={isActive("/explore/17")}
              />
              <SidebarItem
                to="/explore/27"
                icon={<Lightbulb className="mr-2 h-4 w-4" />}
                label="Learning"
                active={isActive("/explore/27")}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SidebarItem = ({ to, icon, label, active }: SidebarItemProps) => {
  return (
    <Button
      asChild
      variant={active ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start",
        active ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
      )}
    >
      <Link to={to}>
        {icon}
        {label}
      </Link>
    </Button>
  );
};

export default Sidebar;
