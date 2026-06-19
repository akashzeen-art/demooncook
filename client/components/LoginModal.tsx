import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { useSubscription, INSUFFICIENT_MSG } from "@/lib/subscription";

interface LoginModalProps {
  onClose: () => void;
}

const T = {
  fr: {
    subscribe:   "Cliquez ici pour vous abonner",
    recharge:    "Rechargez et réessayez",
    inactiveMsg: "Votre abonnement n'est pas actif. Cliquez ci-dessous pour activer.",
  },
  en: {
    subscribe:   "Click here to subscribe",
    recharge:    "Recharge and try again",
    inactiveMsg: "Your subscription is not active. Click below to activate.",
  },
};

export const LoginModal = ({ onClose }: LoginModalProps) => {
  const { login, activationUrl, goToActivation, msisdn, isSubscribed, isInsufficient } = useSubscription();
  const lang = (sessionStorage.getItem("lang") || "fr") as "fr" | "en";
  const [phone, setPhone]     = useState(() => msisdn ? msisdn.replace(/^237/, "") : "");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<{ success: boolean; msg: string; insufficient?: boolean } | null>(() => {
    if (!activationUrl || isSubscribed) return null;
    if (isInsufficient) return { success: false, insufficient: true, msg: INSUFFICIENT_MSG[lang] };
    return { success: false, msg: T[lang].inactiveMsg };
  });
  const inputRef              = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setResult(null);
    const res = await login(phone.replace(/\D/g, ""));
    setLoading(false);
    setResult(res);
    if (res.success) setTimeout(() => onClose(), 1500);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/60"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-1 w-full bg-gradient-to-r from-red-600 to-orange-500" />

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <img src="/logo/logo (1).png" alt="On Cook" className="h-8 w-auto object-contain" />
              <span className="oncook-brand text-lg"><span className="brand-O">O</span>n<span className="brand-C">C</span>ook</span>
            </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-xl font-cinematic text-white mb-1">Login</h2>
            <p className="text-gray-500 text-sm mb-6">Enter your mobile number to access content</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex rounded-xl overflow-hidden border border-white/10 focus-within:border-red-500/50 transition-all">
                <div className="flex items-center gap-1.5 px-3 bg-white/5 border-r border-white/10 text-gray-400 text-sm font-medium whitespace-nowrap">
                   +237
                </div>
                <input
                  ref={inputRef}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder=""
                  className="flex-1 bg-transparent px-3 py-3 text-white placeholder-gray-600 text-sm focus:outline-none"
                />
              </div>

              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <div
                      className={`px-3 py-2.5 rounded-xl text-sm border ${
                        result.success
                          ? "bg-green-500/10 border-green-500/20 text-green-400"
                          : result.insufficient
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {result.success
                          ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        }
                        <span className="leading-relaxed">{result.msg}</span>
                      </div>
                    </div>
                    {!result.success && activationUrl && (
                      <button
                        type="button"
                        onClick={goToActivation}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-semibold rounded-xl transition-all text-sm"
                      >
                        {result.insufficient ? T[lang].recharge : T[lang].subscribe}{" "}
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading || !phone.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm"
              >
                {loading ? (
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="w-1.5 h-1.5 bg-white rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                ) : (
                  <> Login <ArrowRight className="w-4 h-4" /> </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
