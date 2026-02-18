import { Link, useSearchParams, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const currentOrder = searchParams.get("order");
  const currentPath = location.pathname;

  const isActive = (path: string, order?: string) => {
    if (order) {
      return currentOrder === order;
    }
    return currentPath === path && !currentOrder;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">Menu</h3>
        <Link 
          to="/" 
          className={`sidebar-link ${isActive("/") ? "active" : ""}`}
        >
          Home
        </Link>
        <Link 
          to="/trending" 
          className={`sidebar-link ${isActive("/trending") ? "active" : ""}`}
        >
          Trending
        </Link>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">Sort By</h3>
        <Link 
          to="/?order=date" 
          className={`sidebar-link ${isActive("/", "date") ? "active" : ""}`}
        >
          Date
        </Link>
        <Link 
          to="/?order=rating" 
          className={`sidebar-link ${isActive("/", "rating") ? "active" : ""}`}
        >
          Rating
        </Link>
        <Link 
          to="/?order=viewCount" 
          className={`sidebar-link ${isActive("/", "viewCount") ? "active" : ""}`}
        >
          Views
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
