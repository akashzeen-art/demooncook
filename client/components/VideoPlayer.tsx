import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, Maximize2, Gauge } from "lucide-react";

interface VideoPlayerProps {
  video: string;
  image: string;
  title?: string;
  onClose: () => void;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const VideoPlayer = ({ video, image, title, onClose }: VideoPlayerProps) => {
  const videoRef                      = useRef<HTMLVideoElement>(null);
  const [muted, setMuted]             = useState(false);
  const [speed, setSpeed]             = useState(1);
  const [speedOpen, setSpeedOpen]     = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    videoRef.current?.play().catch(() => {});
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const changeSpeed = (s: number) => {
    if (videoRef.current) videoRef.current.playbackRate = s;
    setSpeed(s);
    setSpeedOpen(false);
  };

  const fullscreen = () => {
    videoRef.current?.requestFullscreen().catch(() => {});
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.88, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl shadow-black/80"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative aspect-video bg-black">
            <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <video
              ref={videoRef}
              src={video}
              loop
              playsInline
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/70 to-transparent">
              {title && (
                <span className="text-white font-cinematic text-sm md:text-base truncate max-w-xs">{title}</span>
              )}
              <button
                onClick={onClose}
                className="ml-auto w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-all border border-white/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
              {/* Mute */}
              <button
                onClick={toggleMute}
                className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-all border border-white/20"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Playback speed */}
              <div className="relative">
                <button
                  onClick={() => setSpeedOpen(!speedOpen)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/50 hover:bg-black/80 text-white text-xs font-bold border border-white/20 transition-all"
                >
                  <Gauge className="w-3.5 h-3.5" />
                  {speed}x
                </button>
                {speedOpen && (
                  <div className="absolute bottom-full mb-2 left-0 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                    {SPEEDS.map((s) => (
                      <button
                        key={s}
                        onClick={() => changeSpeed(s)}
                        className={`w-full px-4 py-2 text-xs text-left transition-colors ${
                          s === speed ? "text-white bg-red-600" : "text-gray-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={fullscreen}
                className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-all border border-white/20 ml-auto"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
