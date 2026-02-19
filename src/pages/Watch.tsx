import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Button } from "@/components/ui/button";

interface WatchProps {
  apiKey: string;
}

const Watch = ({ apiKey }: WatchProps) => {
  const { videoId } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [videoId]);

  if (!apiKey || !videoId) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 lg:px-12">
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
          <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
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
                <Button variant="secondary" className="ml-auto rounded-full font-medium">
                  Subscribe
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

        {/* Sidebar / Related Videos (Placeholder for Zen) */}
        <div className="hidden lg:block w-[350px] xl:w-[400px] flex-shrink-0">
          <h3 className="text-white font-bold mb-4">Up Next</h3>
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex gap-2 group cursor-pointer hover:bg-zen-surface/50 p-2 rounded-xl transition-colors">
                <div className="w-40 aspect-video bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-zinc-800 group-hover:bg-zinc-700 transition-colors"></div>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-bold text-white line-clamp-2 leading-tight mb-1">Related Video Title {i}</h4>
                  <span className="text-xs text-zinc-500">Channel Name</span>
                  <span className="text-xs text-zinc-500">10K views</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
