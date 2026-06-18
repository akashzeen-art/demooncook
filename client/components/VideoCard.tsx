import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { VideoPlayer } from "@/components/VideoPlayer";
import { LoginModal } from "@/components/LoginModal";
import { useContentGate } from "@/lib/subscription";

interface VideoCardProps {
  image: string;
  video: string;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

export const VideoCard = ({ image, video, title, className = "", children }: VideoCardProps) => {
  const videoRef                  = useRef<HTMLVideoElement>(null);
  const [hovering, setHovering]   = useState(false);
  const [open, setOpen]           = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { requestAccess }         = useContentGate();

  const handleMouseEnter = () => {
    setHovering(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    setHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleClick = () => {
    requestAccess({
      onGranted: () => setOpen(true),
      onLogin:   () => setShowLogin(true),
    });
  };

  return (
    <>
      <div
        className={`relative overflow-hidden cursor-pointer ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <img
          src={image}
          alt={title ?? ""}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovering ? "opacity-0" : "opacity-100"}`}
        />
        <video
          ref={videoRef}
          src={video}
          muted
          loop
          playsInline
          preload="none"
          controlsList="nodownload nofullscreen"
          onContextMenu={(e) => e.preventDefault()}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovering ? "opacity-100" : "opacity-0"}`}
        />
        {children}
      </div>

      {open && createPortal(
        <VideoPlayer video={video} image={image} title={title} onClose={() => setOpen(false)} />,
        document.body
      )}

      {showLogin && createPortal(
        <LoginModal onClose={() => setShowLogin(false)} />,
        document.body
      )}
    </>
  );
};
