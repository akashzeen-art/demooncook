import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Globe, User, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSubscription } from "@/lib/subscription";
import { LoginModal } from "@/components/LoginModal";

const CATEGORIES = [
  { label: "African",     href: "#african" },
  { label: "Asian",       href: "#asian" },
  { label: "Continental", href: "#continental" },
  { label: "Desserts",    href: "#desserts" },
  { label: "Mexican",     href: "#mexican" },
  { label: "Middle East", href: "#middle-east" },
  { label: "Salads",      href: "#salads" },
];

export const NavbarEn = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [catOpen, setCatOpen]   = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const location                = useLocation();
  const navigate                = useNavigate();
  const catRef                  = useRef<HTMLDivElement>(null);
  const langRef                 = useRef<HTMLDivElement>(null);
  const { isLoggedIn, msisdn }  = useSubscription();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-red-600 to-orange-500 z-[60] transition-all duration-150"
        style={{ width: `${progress}%` }}
      />

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo - left */}
            <Link to="/en" className="flex items-center gap-2 group flex-shrink-0">
              <img src="/logo/logo (1).png" alt="On Cook" className="h-12 md:h-14 w-auto object-contain group-hover:scale-105 transition-transform" />
              <span className="oncook-brand text-xl md:text-2xl"><span className="brand-O">O</span>n<span className="brand-C">C</span>ook</span>
            </Link>

            {/* Center nav */}
            <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              <a href="/en" className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5 group">
                Home
                <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-red-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </a>
              <div ref={catRef} className="relative">
                <button onClick={() => setCatOpen(!catOpen)} className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                  Categories
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {catOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-2 left-0 w-44 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/60"
                    >
                      {CATEGORIES.map((cat) => (
                        <a key={cat.label} href={cat.href} onClick={() => setCatOpen(false)} className="flex items-center px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm">
                          {cat.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right actions */}
            <div className="hidden md:flex items-center gap-2">
              <div ref={langRef} className="relative">
                <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-all">
                  <Globe className="w-3.5 h-3.5" />
                  EN
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-2 right-0 w-36 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/60 z-50"
                    >
                      <button onClick={() => { setLangOpen(false); navigate("/en"); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-white bg-white/5 text-sm font-medium">English</button>
                      <button onClick={() => { setLangOpen(false); navigate("/fr"); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm">Français</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {isLoggedIn ? (
                <button onClick={() => navigate("/account")} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-all">
                  <User className="w-3.5 h-3.5" />
                  <span>My Account</span>
                </button>
              ) : (
                <button onClick={() => setShowLogin(true)} className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all">
                  <LogIn className="w-3.5 h-3.5" /> Login
                </button>
              )}
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden bg-black/95 backdrop-blur-md border-t border-white/10"
            >
              <div className="px-4 py-4 space-y-1">
                <a href="/en" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm font-medium">Home</a>
                <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-widest">Categories</div>
                {CATEGORIES.map((cat) => (
                  <a key={cat.label} href={cat.href} onClick={() => setIsOpen(false)} className="flex items-center px-6 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm">
                    {cat.label}
                  </a>
                ))}
                <div className="pt-3 border-t border-white/10 flex gap-2">
                  <button onClick={() => { setIsOpen(false); navigate("/en"); }} className="flex-1 py-2.5 bg-white/10 text-white text-sm font-semibold rounded-xl">English</button>
                  <button onClick={() => { setIsOpen(false); navigate("/fr"); }} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all">Français</button>
                </div>
                {isLoggedIn ? (
                  <button onClick={() => { setIsOpen(false); navigate("/account"); }} className="w-full flex items-center gap-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm">
                    <User className="w-4 h-4" /> My Account
                  </button>
                ) : (
                  <button onClick={() => { setIsOpen(false); setShowLogin(true); }} className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all">
                    <LogIn className="w-4 h-4" /> Login
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <div className="h-16" />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
};
