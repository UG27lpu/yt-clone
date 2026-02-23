import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { History } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import axios from "axios";

interface Snippet {
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  thumbnails: {
    medium: { url: string };
    high: { url: string };
  };
  resourceId?: { videoId: string };
}

interface VideoItem {
  id: string | { videoId: string };
  snippet: Snippet;
  statistics?: {
    viewCount: string;
    likeCount: string;
  };
}

const Home = ({ isTrending = false, isHistory = false }: { isTrending?: boolean, isHistory?: boolean }) => {
  const { apiKey } = useAuth();
  const { isSidebarOpen } = useSidebar();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const query = searchParams.get("q");
  const order = searchParams.get("order");

  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  useEffect(() => {
    setVideos([]);
    setNextPageToken(null);
    fetchVideos();
  }, [apiKey, query, order, isTrending, categoryId, isHistory]);

  const fetchVideos = async (pageToken?: string) => {
    if (!apiKey && !isHistory) return;

    setLoading(true);
    setError(null);

    try {
      if (isHistory) {
        const history = JSON.parse(localStorage.getItem("watchHistory") || "[]");
        setVideos(history);
        setLoading(false);
        return;
      }
      let url = "";
      let baseUrl = "";

      if (isTrending) {
        baseUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=24&regionCode=US&key=${apiKey}`;
      }
      else if (categoryId) {
        baseUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=24&videoCategoryId=${categoryId}&regionCode=US&key=${apiKey}`;
      }
      else if (query || order) {
        const searchQueryStr = query ? `&q=${encodeURIComponent(query)}` : '';
        const orderParam = order ? `&order=${order}` : '&order=relevance';
        baseUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet${searchQueryStr}&maxResults=24&type=video&key=${apiKey}${orderParam}`;
      }
      else {
        baseUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=24&regionCode=US&key=${apiKey}`;
      }

      url = `${baseUrl}${pageToken ? `&pageToken=${pageToken}` : ""}`;

      const response = await axios.get(url);
      const data = response.data;

      setNextPageToken(data.nextPageToken || null);

      let newVideos = [];

      if (query || order || (!isTrending && url.includes("/search"))) {
        const videoIds = data.items.map((item: any) => (item.id.videoId || item.id)).join(',');
        if (videoIds) {
          const statsResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${apiKey}`);
          const statsData = statsResponse.data;

          newVideos = data.items.map((item: any) => {
            const videoId = item.id.videoId || item.id;
            const stats = statsData.items.find((statItem: any) => statItem.id === videoId);
            return { ...item, statistics: stats?.statistics };
          });
        }
      } else {
        newVideos = data.items;
      }

      // Append new videos if we are fetching a pageToken, otherwise replace
      if (pageToken) {
        setVideos(prev => [...prev, ...newVideos]);
      } else {
        setVideos(newVideos);
      }

    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error?.message || err.message);
      } else {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Infinite Scroll Handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading && nextPageToken) {
        fetchVideos(nextPageToken);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, nextPageToken]);


  const formatViews = (views?: string) => {
    if (!views) return "0 views";
    const num = parseInt(views, 10);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`;
    return `${num} views`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 365) return `${Math.floor(diffDays / 365)} years ago`;
    if (diffDays > 30) return `${Math.floor(diffDays / 30)} months ago`;
    if (diffDays > 0) return `${diffDays} days ago`;
    return "Today";
  };

  const gridClasses = isSidebarOpen
    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4";

  return (
    <div className="p-6 md:p-8 pt-24 min-h-screen">
      {error && (
        <div className="text-red-400 p-6 text-center bg-red-900/10 rounded-xl mb-6 border border-red-900/20">
          <p className="mb-2">Error: {error}</p>
          <button
            onClick={() => fetchVideos()}
            className="mt-2 text-sm bg-zen-surface hover:bg-zen-hover text-zen-text px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty History State */}
      {!loading && !error && isHistory && videos.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in duration-700">
          <div className="bg-zinc-800/50 p-6 rounded-full mb-6 border-2 border-dashed border-zinc-700">
            <History className="h-16 w-16 text-zen-subtext" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-zen-text mb-2">Watch history is empty</h2>
          <p className="text-zen-subtext max-w-sm mx-auto">
            Your watch history will appear here once you start watching videos.
          </p>
        </div>
      )}

      {/* Video Grid - Bigger Thumbnails */}
      <div className={`grid ${gridClasses} gap-y-10 gap-x-6`}>
        {videos.map((video) => {
          const videoId = typeof video.id === 'string' ? video.id : video.id.videoId;
          return (
            <div
              key={videoId}
              className="group cursor-pointer flex flex-col gap-3"
              onClick={() => navigate(`/watch/${videoId}`)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-card border-2 border-border/50 group-hover:border-primary/50 shadow-lg group-hover:shadow-[0_0_20px_-5px_rgba(203,166,247,0.3)] transition-all duration-300">
                <img
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                  src={video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="flex gap-3 items-start px-1">
                {/* Channel Avatar Placeholder */}
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-zen-surface flex items-center justify-center text-[10px] font-bold text-zen-subtext group-hover:text-zen-text transition-colors border border-border">
                    {video.snippet.channelTitle ? video.snippet.channelTitle.charAt(0).toUpperCase() : '?'}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-zen-text font-bold text-[15px] leading-snug line-clamp-2 group-hover:text-primary">
                    {video.snippet.title}
                  </h3>
                  <div className="text-zen-subtext text-xs flex flex-col">
                    <span className="hover:text-zen-text transition-colors">{video.snippet.channelTitle}</span>
                    <span className="mt-0.5">{video.statistics ? formatViews(video.statistics.viewCount) : 'Views unavailable'} • {formatTime(video.snippet.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {loading && (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={`loading-${i}`} className="flex flex-col gap-3">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <div className="flex gap-3 px-1">
                <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                <div className="flex flex-col gap-2 w-full">
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-3 w-[60%]" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
