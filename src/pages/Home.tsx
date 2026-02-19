import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

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

const Home = ({ apiKey, isTrending = false }: { apiKey: string, isTrending?: boolean }) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q");
  const order = searchParams.get("order");

  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [prevPageToken, setPrevPageToken] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, [apiKey, query, order, isTrending]);

  const fetchVideos = async (pageToken?: string) => {
    if (!apiKey) return;

    setLoading(true);
    setError(null);

    try {
      let url = "";
      let baseUrl = "";

      if (isTrending) {
        baseUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=24&regionCode=US&key=${apiKey}`;
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

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setNextPageToken(data.nextPageToken || null);
      setPrevPageToken(data.prevPageToken || null);

      if (query || order || (!isTrending && url.includes("/search"))) {
        const videoIds = data.items.map((item: any) => (item.id.videoId || item.id)).join(',');
        if (videoIds) {
          const statsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${apiKey}`);
          const statsData = await statsResponse.json();

          const itemsWithStats = data.items.map((item: any) => {
            const videoId = item.id.videoId || item.id;
            const stats = statsData.items.find((statItem: any) => statItem.id === videoId);
            return { ...item, statistics: stats?.statistics };
          });
          setVideos(itemsWithStats);
        } else {
          setVideos([]);
        }
      } else {
        setVideos(data.items);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (nextPageToken) {
      fetchVideos(nextPageToken);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (prevPageToken) {
      fetchVideos(prevPageToken);
      window.scrollTo(0, 0);
    }
  };

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

  if (loading && videos.length === 0) {
    return (
      <div className="p-6 md:p-8 pt-24 min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-10 gap-x-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <div className="flex gap-3 px-1">
                <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                <div className="flex flex-col gap-2 w-full">
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-3 w-[60%]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 pt-24 min-h-screen">
      {error && (
        <div className="text-red-400 p-6 text-center bg-red-900/10 rounded-xl mb-6 border border-red-900/20">
          <p className="mb-2">Error: {error}</p>
          <button
            onClick={() => fetchVideos()}
            className="mt-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && !error && (
        <>
          {prevPageToken && (
            <div
              className="fixed bottom-8 left-1/2 -translate-x-[60px] w-12 h-12 bg-zen-surface hover:bg-zinc-800 hover:scale-110 backdrop-blur rounded-full flex items-center justify-center cursor-pointer transition-all z-40 shadow-xl border border-white/5 active:scale-90"
              onClick={handlePrevPage}
              title="Previous Page"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-zinc-400" fill="currentColor"><g><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></g></svg>
            </div>
          )}
          {nextPageToken && (
            <div
              className="fixed bottom-8 left-1/2 translate-x-[16px] w-12 h-12 bg-zen-surface hover:bg-zinc-800 hover:scale-110 backdrop-blur rounded-full flex items-center justify-center cursor-pointer transition-all z-40 shadow-xl border border-white/5 active:scale-90"
              onClick={handleNextPage}
              title="Next Page"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-zinc-400" fill="currentColor"><g><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></g></svg>
            </div>
          )}
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-10 gap-x-6">
        {videos.map((video) => {
          const videoId = typeof video.id === 'string' ? video.id : video.id.videoId;
          return (
            <div
              key={videoId}
              className="group cursor-pointer flex flex-col gap-3"
              onClick={() => navigate(`/watch/${videoId}`)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 shadow-md group-hover:shadow-2xl transition-all duration-300 ring-1 ring-white/5 group-hover:ring-white/10">
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
                  <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500 group-hover:text-white transition-colors border border-white/5">
                    {video.snippet.channelTitle ? video.snippet.channelTitle.charAt(0).toUpperCase() : '?'}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-white font-bold text-[15px] leading-snug line-clamp-2 group-hover:text-white/90">
                    {video.snippet.title}
                  </h3>
                  <div className="text-zinc-500 text-xs flex flex-col">
                    <span className="hover:text-zinc-300 transition-colors">{video.snippet.channelTitle}</span>
                    <span className="mt-0.5">{video.statistics ? formatViews(video.statistics.viewCount) : 'Views unavailable'} • {formatTime(video.snippet.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
