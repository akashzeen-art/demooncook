import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { VideoCard } from "@/components/VideoCard";
import type { EnVideo } from "@/lib/videos-en";

interface CategorySectionProps {
  title: string;
  emoji: string;
  videos: EnVideo[];
  accentColor?: string;
  accentHex?: string;
  dark?: boolean;
}

export const CategorySection = ({
  title,
  emoji,
  videos,
  accentColor = "bg-red-500",
  accentHex = "#ef4444",
  dark = true,
}: CategorySectionProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    sliderRef.current?.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  };

  return (
    <section className={`relative py-12 md:py-16 overflow-hidden ${dark ? "bg-zinc-950" : "bg-zinc-900"}`}>
      {/* Subtle top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${accentHex}55, transparent)` }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-3">
            <span className="text-3xl">{emoji}</span>
            <div>
              <h2 className="text-2xl md:text-3xl font-cinematic text-white">{title}</h2>
              <div className={`h-0.5 mt-1 rounded-full ${accentColor}`} style={{ width: "2.5rem" }} />
            </div>
          </motion.div>
          <div className="flex gap-2">
            <button onClick={() => scroll("left")} className="w-9 h-9 rounded-full bg-white/8 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll("right")} className="w-9 h-9 rounded-full bg-white/8 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div ref={sliderRef} className="flex gap-5 overflow-x-auto scrollbar-hide pb-3">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group flex-shrink-0 w-56 md:w-64 cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 shadow-lg shadow-black/40">
                <VideoCard image={video.image} video={video.video} title={video.title} className="absolute inset-0 w-full h-full">
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-12 h-12 rounded-full flex items-center justify-center shadow-2xl"
                      style={{ backgroundColor: accentHex }}
                    >
                      <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                    </motion.div>
                  </div>
                </VideoCard>
              </div>

              {/* Title below card */}
              <div className="px-1">
                <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2 group-hover:text-gray-200 transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs mt-1 font-medium" style={{ color: accentHex }}>{video.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
