import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface WatchProps {
  apiKey: string;
}

const Watch = ({ apiKey }: WatchProps) => {
  const { videoId } = useParams();
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [videoId]);

  // Fetch video details and related videos
  useEffect(() => {
    const fetchData = async () => {
      if (!apiKey || !videoId) return;
      try {
        // 1. Fetch Video Details & Save History
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`);
        const data = await response.json();

        if (data.items?.[0]) {
          const video = data.items[0];
          const history = JSON.parse(localStorage.getItem("watchHistory") || "[]");
          const newHistory = [video, ...history.filter((v: any) => (v.id.videoId || v.id) !== (video.id.videoId || video.id))].slice(0, 50);
          localStorage.setItem("watchHistory", JSON.stringify(newHistory));
        }

        // 2. Fetch Related Videos
        const relatedResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=15&key=${apiKey}`);
        const relatedData = await relatedResponse.json();
        setRelatedVideos(relatedData.items || []);

      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [videoId, apiKey]);

  if (!apiKey || !videoId) return null;

  return (
    <div className="min-h-screen pb-12 px-4 md:px-8 lg:px-12 py-6">
      <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-8">
        {/* Main Content: Player + Info */}
        <div className="flex-1 w-full lg:w-[75%]">
          {/* Back Navigation */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-4 transition-colors text-sm font-medium group"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
            Back to Home
          </Link>

          {/* Player Wrapper */}
          <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-border/50 hover:border-primary/30 transition-colors">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full border-0"
            ></iframe>
          </div>

          {/* Video Metadata */}
          <div className="mt-6">
            <h1 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">
              YouTube Video {videoId}
            </h1>

            <div className="bg-zen-surface rounded-xl p-4 border border-zinc-800/50">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-zinc-800">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  Y
                </div>
                <div>
                  <h3 className="font-bold text-white">YouTube Creator</h3>
                  <span className="text-xs text-zinc-500">1.2M subscribers</span>
                </div>
                <Button
                  variant={isSubscribed ? "secondary" : "default"}
                  className={`ml-auto rounded-full font-medium ${isSubscribed ? "bg-zinc-700 text-white hover:bg-zinc-600" : ""}`}
                  onClick={() => setIsSubscribed(!isSubscribed)}
                >
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </Button>
              </div>

              <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                <p>This is a simulated description for the video with ID: <span className="text-white font-mono bg-zinc-800 px-1.5 py-0.5 rounded">{videoId}</span>.</p>
                <br />
                <p className="text-zinc-500">On a real app, we would fetch snippet.description here. The current focus is on the Zen UI aesthetic—clean lines, high contrast, and minimal distractions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Related Videos */}
        <div className="hidden lg:block w-[350px] xl:w-[400px] flex-shrink-0">
          <h3 className="text-white font-bold mb-4">Up Next</h3>
          <div className="flex flex-col gap-3">
            {relatedVideos.length > 0 ? (
              relatedVideos.map((video) => {
                const relId = video.id.videoId || video.id;
                return (
                  <Link key={relId} to={`/watch/${relId}`} className="flex gap-2 group cursor-pointer hover:bg-zen-surface/50 p-2 rounded-xl transition-colors">
                    <div className="w-40 aspect-video bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <img
                        src={video.snippet.thumbnails.medium.url}
                        alt={video.snippet.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-bold text-white line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors">
                        {video.snippet.title}
                      </h4>
                      <span className="text-xs text-zinc-500">{video.snippet.channelTitle}</span>
                    </div>
                  </Link>
                );
              })
            ) : (
              /* Skeleton / Placeholder state if needed, or keep previous mock as fallback? 
                 Let's just show a clear message or skeleton if empty, but for now map is safe */
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-2 p-2 animate-pulse">
                  <div className="w-40 aspect-video bg-zinc-800 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-800 rounded w-full"></div>
                    <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
