import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronRight } from "lucide-react";
import { EN_VIDEOS } from "@/lib/videos-en";

const BANNERS = [
  { image: EN_VIDEOS.african[0].image,    video: EN_VIDEOS.african[0].video,    title: "African Kitchen",       category: "African",     desc: "Bold spices, rich stews and the vibrant soul of African cooking." },
  { image: EN_VIDEOS.asian[6].image,      video: EN_VIDEOS.asian[6].video,      title: "Asian Flavors",         category: "Asian",       desc: "From silky soups to crispy stir-fries — Asia on your plate." },
  { image: EN_VIDEOS.continental[8].image,video: EN_VIDEOS.continental[8].video,title: "Continental Classics",  category: "Continental", desc: "Timeless European recipes crafted with love and precision." },
  { image: EN_VIDEOS.mexican[3].image,    video: EN_VIDEOS.mexican[3].video,    title: "Mexican Fiesta",        category: "Mexican",     desc: "Smoky, spicy and full of colour — the heart of Mexican cuisine." },
  { image: EN_VIDEOS.salads[7].image,     video: EN_VIDEOS.salads[7].video,     title: "Fresh & Light",         category: "Salads",      desc: "Crisp, healthy and bursting with flavour in every bite." },
];

const CATEGORY_COLORS: Record<string, string> = {
  African:     "bg-orange-500",
  Asian:       "bg-red-500",
  Continental: "bg-yellow-500",
  Mexican:     "bg-green-500",
  Salads:      "bg-emerald-500",
};

export const HeroSectionEn = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((p) => (p + 1) % BANNERS.length), 7000);
    return () => clearInterval(t);
  }, []);

  const banner = BANNERS[index];
  const color  = CATEGORY_COLORS[banner.category] ?? "bg-red-500";

  return (
    <section className="relative min-h-[100svh] flex items-end pb-16 md:pb-28 overflow-hidden">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover" />
          <video key={banner.video} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src={banner.video} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Thumbnail strip — right side */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 z-20">
        {BANNERS.map((b, i) => (
          <motion.button
            key={i}
            onClick={() => setIndex(i)}
            whileHover={{ scale: 1.05 }}
            className={`relative w-28 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${i === index ? "border-white shadow-lg shadow-black/60" : "border-white/20 opacity-50 hover:opacity-80"}`}
          >
            <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
            {i === index && <div className="absolute inset-0 bg-white/10" />}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl space-y-4 md:space-y-6"
          >
            <motion.span
              className={`inline-flex items-center gap-2 px-4 py-1.5 ${color} text-white text-xs font-bold rounded-full tracking-widest uppercase shadow-lg`}
            >
              {banner.category}
            </motion.span>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-cinematic text-white leading-none drop-shadow-2xl">
              {banner.title}
            </h1>

            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-md leading-relaxed">
              {banner.desc}
            </p>

            <div className="flex gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all text-sm md:text-base shadow-xl"
              >
                <Play className="w-4 h-4 fill-black" /> Watch Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all backdrop-blur-sm text-sm md:text-base"
              >
                Explore <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="flex gap-2 mt-10">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${i === index ? "w-10 bg-white" : "w-3 bg-white/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
