import { Link, useSearchParams, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

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
    <aside className="fixed left-0 top-0 h-full w-16 hover:w-64 bg-zen-bg border-r border-zinc-900 z-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden flex flex-col py-4 group hover:shadow-2xl">
      <div className="flex-1">
        <div className="mb-6">
          <SectionTitle>Menu</SectionTitle>
          <NavItem to="/" active={isActive("/")} icon={<HomeIcon />} label="Home" />
          <NavItem to="/trending" active={isActive("/trending")} icon={<TrendingIcon />} label="Trending" />
        </div>

        <div className="mb-6 pt-4 border-t border-zinc-900/50">
          <SectionTitle>Sort</SectionTitle>
          <NavItem to="/?order=date" active={isActive("/", "date")} icon={<NewestIcon />} label="Newest" />
          <NavItem to="/?order=viewCount" active={isActive("/", "viewCount")} icon={<PopularIcon />} label="Popular" />
        </div>
      </div>
    </aside>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="px-6 mb-2 text-xs font-bold text-zinc-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
    {children}
  </h3>
);

const NavItem = ({ to, active, icon, label }: { to: string; active: boolean; icon: React.ReactNode; label: string }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center px-4 py-3 mx-2 my-1 rounded-xl transition-all duration-200 whitespace-nowrap overflow-hidden group/item",
      active ? "bg-zinc-800 text-white" : "text-gray-400 hover:bg-zinc-800/50 hover:text-white"
    )}
  >
    {icon}
    <span className="ml-6 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-[-10px] group-hover:translate-x-0">
      {label}
    </span>
  </Link>
);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 min-w-[24px]" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const TrendingIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 min-w-[24px]" fill="currentColor">
    <path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8z" />
  </svg>
);

const NewestIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 min-w-[24px]" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
  </svg>
);

const PopularIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 min-w-[24px]" fill="currentColor">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

export default Sidebar;
