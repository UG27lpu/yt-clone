import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

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
      
      // If we are in "Trending" mode, strictly use mostPopular chart
      if (isTrending) {
        baseUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=24&regionCode=US&key=${apiKey}`;
      } 
      // If we have a specific order (sort) OR a search query, use search endpoint
      else if (query || order) {
        const searchQueryStr = query ? `&q=${encodeURIComponent(query)}` : '';
        const orderParam = order ? `&order=${order}` : '&order=relevance';
        baseUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet${searchQueryStr}&maxResults=24&type=video&key=${apiKey}${orderParam}`;
      } 
      // Default Home view (Popular)
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

      // If using search endpoint, we need to fetch statistics separately
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
      <div className="loading-screen" style={{ position: 'absolute' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div style={{ color: "#ff6b6b", padding: "20px", textAlign: "center" }}>
          Error: {error}
          <br />
          <button 
            onClick={() => fetchVideos()}
            style={{marginTop: '10px', background: '#333', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer'}}
          >
            Retry
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && !error && (
        <>
          {prevPageToken && (
            <div className="pagination-btn prev" onClick={handlePrevPage} title="Previous Page">
              <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style={{ pointerEvents: 'none', display: 'block', width: '24px', height: '24px', fill: 'white' }}><g><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></g></svg>
            </div>
          )}
          {nextPageToken && (
            <div className="pagination-btn next" onClick={handleNextPage} title="Next Page">
              <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style={{ pointerEvents: 'none', display: 'block', width: '24px', height: '24px', fill: 'white' }}><g><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></g></svg>
            </div>
          )}
        </>
      )}

      <div className="video-grid">
        {videos.map((video) => {
          const videoId = typeof video.id === 'string' ? video.id : video.id.videoId;
          return (
            <div key={videoId} className="video-card" onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')}>
              <div className="thumbnail-container">
                <img 
                  className="thumbnail-image"
                  src={video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium.url} 
                  alt={video.snippet.title} 
                  loading="lazy"
                />
              </div>
              <div className="video-info">
                <div className="channel-avatar">
                  <div style={{
                    width: '100%', 
                    height: '100%', 
                    borderRadius: '50%', 
                    background: `hsl(${Math.random() * 360}, 50%, 50%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {video.snippet.channelTitle ? video.snippet.channelTitle.charAt(0).toUpperCase() : '?'}
                  </div>
                </div>
                <div className="video-details">
                  <h3 className="video-title" title={video.snippet.title}>
                    {video.snippet.title}
                  </h3>
                  <div className="channel-name">
                    {video.snippet.channelTitle}
                  </div>
                  <div className="video-meta">
                    {video.statistics ? formatViews(video.statistics.viewCount) : 'Views unavailable'} • {formatTime(video.snippet.publishedAt)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Home;
