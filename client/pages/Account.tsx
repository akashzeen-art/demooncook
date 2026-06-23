import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Calendar, Phone, Shield, DollarSign, LogOut, ArrowLeft, RefreshCw, CheckCircle, AlertCircle, X } from "lucide-react";
import { useSubscription } from "@/lib/subscription";
import { Navbar } from "@/components/Navbar";
import { NavbarEn } from "@/components/en/NavbarEn";
import { Footer } from "@/components/Footer";
import { FooterEn } from "@/components/en/FooterEn";

const T = {
  fr: {
    back:           "Retour",
    title:          "Mon Compte",
    subscriber:     "Abonné",
    active:         "Abonnement Actif",
    inactive:       "Aucun Abonnement Actif",
    details:        "Détails de l'Abonnement",
    mobile:         "Mobile",
    price:          "Prix",
    activated:      "Activé le",
    renews:         "Renouvellement",
    validity:       "Validité",
    days:           "jour(s)",
    cancelMsg:      "Voulez-vous annuler votre abonnement ?",
    confirmTitle:   "Confirmer la désinscription",
    confirmBody:    "Voulez-vous vous désabonner du service On Cook ?",
    confirmYes:     "Oui, se désabonner",
    confirmNo:      "Non, annuler",
    unsubscribe:    "Se désabonner",
    unsubscribing:  "Désabonnement...",
  },
  en: {
    back:           "Back",
    title:          "My Account",
    subscriber:     "Subscriber",
    active:         "Active Subscription",
    inactive:       "No Active Subscription",
    details:        "Subscription Details",
    mobile:         "Mobile",
    price:          "Price",
    activated:      "Activated",
    renews:         "Renews On",
    validity:       "Validity",
    days:           "day(s)",
    cancelMsg:      "Want to cancel your subscription?",
    confirmTitle:   "Confirm Unsubscribe",
    confirmBody:    "Do you want to unsubscribe from On Cook service?",
    confirmYes:     "Yes, unsubscribe",
    confirmNo:      "No, cancel",
    unsubscribe:    "Unsubscribe",
    unsubscribing:  "Unsubscribing...",
  },
};

export default function Account() {
  const { detail, msisdn, isSubscribed, unsubscribe } = useSubscription();
  const navigate   = useNavigate();
  const lang       = (sessionStorage.getItem("lang") || "fr") as "fr" | "en";
  const t          = T[lang];
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<{ success: boolean; msg: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!showConfirm) return;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setShowConfirm(false); };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [showConfirm]);

  const handleUnsub = async () => {
    setLoading(true);
    setResult(null);
    const res = await unsubscribe();
    setLoading(false);
    setShowConfirm(false);
    setResult(res);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-black min-h-screen text-white">
      {lang === "en" ? <NavbarEn /> : <Navbar />}

      <div className="max-w-2xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> {t.back}
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-600/20 border border-red-500/30 rounded-full flex items-center justify-center">
              <User className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-cinematic text-white">{t.title}</h1>
              <p className="text-gray-500 text-sm">{msisdn || t.subscriber}</p>
            </div>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm border ${
                  result.success
                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}
              >
                {result.success
                  ? <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                }
                <span className="leading-relaxed">{result.msg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isSubscribed ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"}`}>
            <div className={`w-3 h-3 rounded-full animate-pulse ${isSubscribed ? "bg-green-500" : "bg-red-500"}`} />
            <span className={`font-semibold text-sm ${isSubscribed ? "text-green-400" : "text-red-400"}`}>
              {isSubscribed ? t.active : t.inactive}
            </span>
          </div>

          {detail && (
            <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{t.details}</h2>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  { icon: <Phone className="w-4 h-4 text-blue-400" />,        label: t.mobile,    value: detail.msisdn },
                  { icon: <Shield className="w-4 h-4 text-red-400" />,        label: t.price,     value: detail.pricePoint },
                  { icon: <Calendar className="w-4 h-4 text-green-400" />,    label: t.activated, value: detail.actDate },
                  { icon: <RefreshCw className="w-4 h-4 text-orange-400" />,  label: t.renews,    value: detail.renewDate },
                  { icon: <DollarSign className="w-4 h-4 text-yellow-400" />, label: t.validity,  value: `${detail.validity || "1"} ${Number(detail.validity || 1) === 1 ? (lang === "fr" ? "jour" : "day") : (lang === "fr" ? "jours" : "days")}` },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-4 px-5 py-4">
                    {row.icon}
                    <span className="text-gray-500 text-sm w-28">{row.label}</span>
                    <span className="text-white text-sm font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-white/10 space-y-3">
            {isSubscribed && msisdn && (
              <div>
                <p className="text-gray-500 text-sm mb-3">{t.cancelMsg}</p>
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 border border-red-500/50 text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-50 shadow-lg shadow-red-600/20"
                >
                  <LogOut className="w-4 h-4" />
                  {loading ? t.unsubscribing : t.unsubscribe}
                </button>
              </div>
            )}
          </div>

        </motion.div>
      </div>

      {lang === "en" ? <FooterEn /> : <Footer />}

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/60"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1 w-full bg-gradient-to-r from-red-600 to-red-400" />

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-cinematic text-white">{t.confirmTitle}</h3>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">{t.confirmBody}</p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleUnsub}
                    disabled={loading}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all text-sm disabled:opacity-50"
                  >
                    {loading ? t.unsubscribing : t.confirmYes}
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    disabled={loading}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-xl transition-all text-sm"
                  >
                    {t.confirmNo}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
