import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Globe, Play } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EN_VIDEOS } from "@/lib/videos-en";
import { VIDEOS } from "@/lib/videos";

const PREVIEW_CARDS = [
  { image: "/COOKING/i1.jpg",  video: VIDEOS[1],  label: "Saveurs du Monde",        lang: "🇫🇷" },
  { image: "/thumbnails/African/1.THEBESTNIGERIANEGUSISOUPRECIPE _ EGUSISOUPRECIPE.mp4.png", video: EN_VIDEOS.african[0].video, label: "Nigerian Egusi Soup", lang: "🇬🇧" },
  { image: "/COOKING/i3.jpg",  video: VIDEOS[3],  label: "Recettes Secrètes",        lang: "🇫🇷" },
  { image: "/thumbnails/asian/Honey_Roasted_Chicken.mp4.png", video: EN_VIDEOS.asian[6].video, label: "Honey Roasted Chicken", lang: "🇬🇧" },
  { image: "/COOKING/i5.jpg",  video: VIDEOS[5],  label: "L'Art de la Pâtisserie",   lang: "🇫🇷" },
  { image: "/thumbnails/continental/Margherita Pizza.mp4.png", video: EN_VIDEOS.continental[8].video, label: "Margherita Pizza", lang: "🇬🇧" },
];

function HomeNavbar() {
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langRef                 = useRef<HTMLDivElement>(null);
  const navigate                = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src="/logo/logo (1).png" alt="On Cook" className="h-12 md:h-14 w-auto object-contain" />
            <span className="oncook-brand text-xl md:text-2xl"><span className="brand-O">O</span>n<span className="brand-C">C</span>ook</span>
          </div>

          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-all"
            >
              <Globe className="w-4 h-4" />
              Choose Language
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 right-0 w-40 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/60"
                >
                  <button onClick={() => navigate("/en", { state: { skipLoader: true } })} className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm">
                    English
                  </button>
                  <button onClick={() => navigate("/fn", { state: { skipLoader: true } })} className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm">
                    Français
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(() => !sessionStorage.getItem("preloaderShown"));

  const handleComplete = () => {
    sessionStorage.setItem("preloaderShown", "1");
    setIsLoading(false);
  };
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingSpinner onComplete={handleComplete} />;
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <HomeNavbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src="/COOKING/i2.jpg" alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black" />
        </div>
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full bg-red-600/8 blur-[160px] pointer-events-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            className="flex flex-col items-center mb-6"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <img src="/logo/logo (1).png" alt="On Cook" className="h-24 md:h-36 w-auto object-contain mx-auto" />
            <span className="oncook-brand text-3xl md:text-4xl mt-2"><span className="brand-O">O</span>n<span className="brand-C">C</span>ook</span>
          </motion.div>
          <motion.h1
            className="text-3xl md:text-5xl font-cinematic text-white mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            Premium Culinary Entertainment
            <br />
            <span className="text-red-500">Divertissement Culinaire Premium</span>
          </motion.h1>
          <motion.p
            className="text-gray-400 text-base md:text-lg mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Explore world cuisines in English & French · Explorez les cuisines du monde en anglais et en français
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <button
              onClick={() => navigate("/en", { state: { skipLoader: true } })}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/30 text-base"
            >
              <Play className="w-5 h-5 fill-white" /> Watch in English
            </button>
            <button
              onClick={() => navigate("/fn", { state: { skipLoader: true } })}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all text-base"
            >
              <Play className="w-5 h-5 fill-white" /> Regarder en Français
            </button>
          </motion.div>
        </div>
      </section>

      {/* What's inside */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-cinematic text-white mb-3">What's Inside</h2>
          <div className="w-16 h-1 bg-red-500 rounded-full mx-auto mb-4" />
          <p className="text-gray-400 text-base max-w-xl mx-auto">
            7 English categories · Hundreds of French culinary shows · All in one place
          </p>
        </motion.div>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {["🌍 African", "🍜 Asian", "🍕 Continental", "🍰 Desserts", "🌮 Mexican", "🥙 Middle East", "🥗 Salads", "French Originals"].map((cat, i) => (
            <motion.span
              key={cat}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 hover:text-white hover:border-red-500/50 hover:bg-red-600/10 transition-all cursor-default"
            >
              {cat}
            </motion.span>
          ))}
        </div>

        {/* Preview cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
          {PREVIEW_CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer"
              onClick={() => navigate(card.lang === "🇬🇧" ? "/en" : "/fn")}
            >
              <img src={card.image} alt={card.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-2xl">
                  <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="text-lg">{card.lang}</span>
                <h3 className="text-white font-cinematic text-sm leading-tight">{card.label}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center px-4 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl font-cinematic text-white mb-6">Choose Your Language · Choisissez votre langue</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/en", { state: { skipLoader: true } })} className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all text-base shadow-lg shadow-red-600/30">
              English
            </button>
            <button onClick={() => navigate("/fn", { state: { skipLoader: true } })} className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all text-base">
              Français
            </button>
          </div>
        </motion.div>
        <p className="text-gray-700 text-xs mt-10">Made with passion · Fait avec passion</p>
      </section>
    </div>
  );
}
