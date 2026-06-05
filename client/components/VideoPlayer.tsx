import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, Maximize2, Gauge, Play, Pause } from "lucide-react";

interface VideoPlayerProps {
  video: string;
  image: string;
  title?: string;
  onClose: () => void;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export const VideoPlayer = ({ video, image, title, onClose }: VideoPlayerProps) => {
  const videoRef                      = useRef<HTMLVideoElement>(null);
  const progressRef                   = useRef<HTMLDivElement>(null);
  const [muted, setMuted]             = useState(false);
  const [playing, setPlaying]         = useState(true);
  const [speed, setSpeed]             = useState(1);
  const [speedOpen, setSpeedOpen]     = useState(false);
  const [current, setCurrent]         = useState(0);
  const [duration, setDuration]       = useState(0);

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

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  const changeSpeed = (s: number) => {
    if (videoRef.current) videoRef.current.playbackRate = s;
    setSpeed(s);
    setSpeedOpen(false);
  };

  const fullscreen = () => {
    videoRef.current?.requestFullscreen().catch(() => {});
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrent(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect  = progressRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = ratio * duration;
  };

  const progress  = duration > 0 ? (current / duration) * 100 : 0;
  const remaining = duration > 0 ? duration - current : 0;

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
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            />

            {/* Mobile tap overlay for play/pause */}
            <div
              className="absolute inset-0 flex items-center justify-center md:hidden"
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            >
              <AnimatePresence>
                {!playing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center border border-white/30"
                  >
                    <Play className="w-7 h-7 fill-white text-white ml-1" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent">

              {/* Progress bar */}
              <div
                ref={progressRef}
                onClick={handleProgressClick}
                className="w-full h-1.5 bg-white/20 rounded-full mb-3 cursor-pointer group"
              >
                <div
                  className="h-full bg-red-500 rounded-full relative transition-all duration-100"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
                </div>
              </div>

              {/* Time + controls row */}
              <div className="flex items-center gap-3">
              {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-all border border-white/20"
                >
                  {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                {/* Mute */}
                <button
                  onClick={toggleMute}
                  className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-all border border-white/20"
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Time display */}
                <span className="text-white text-xs font-mono">
                  {fmt(current)}
                </span>
                <span className="text-gray-400 text-xs font-mono">
                  -{fmt(remaining)}
                </span>

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
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
