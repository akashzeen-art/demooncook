import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play, CheckCircle, ArrowLeft, ArrowRight, AlertCircle, ExternalLink } from "lucide-react";
import { useSubscription } from "@/lib/subscription";

export default function Subscribe() {
  const navigate                    = useNavigate();
  const { login, activationUrl, goToActivation } = useSubscription();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<{ success: boolean; msg: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setResult(null);
    const res = await login(phone.replace(/\D/g, ""));
    setLoading(false);
    if (res.success) navigate("/");
    else setResult(res);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0">
        <img src="/COOKING/i2.jpg" alt="" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <img src="/logo/logo (1).png" alt="On Cook" className="h-16 w-auto object-contain mx-auto mb-1" />
          <h1 className="oncook-brand text-3xl"><span className="brand-O">O</span>n<span className="brand-C">C</span>ook</h1>
          <p className="text-gray-400 text-sm mt-1">Premium Culinary Entertainment</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 space-y-3">
          {["🌍 African, Asian, Continental & more", "French original culinary shows", "🎬 HD video streaming", "📱 Watch on any device"].map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm">{f}</span>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-white font-cinematic text-lg mb-1">Enter your mobile number</h2>
            <p className="text-gray-500 text-xs">Already subscribed? Enter your number to access content.</p>
          </div>

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

            {result && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border bg-red-500/10 border-red-500/20 text-red-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {result.msg}
                </div>
                {activationUrl && (
                  <button
                    type="button"
                    onClick={goToActivation}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-semibold rounded-xl transition-all text-sm"
                  >
                    Click here to subscribe <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            )}

            <button type="submit" disabled={loading || !phone.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all text-sm">
              {loading ? (
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <motion.div key={i} className="w-1.5 h-1.5 bg-white rounded-full"
                      animate={{ y: [0,-5,0] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }} />
                  ))}
                </div>
              ) : <><Play className="w-4 h-4 fill-white" /> Access Content <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="border-t border-white/10 pt-4 space-y-2">
            <p className="text-gray-500 text-xs text-center">Not subscribed yet?</p>
            <a href="https://oncook.co/cmd/cnt/cat/portal/p?pid=131"
              className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-xl transition-all text-sm">
              Subscribe via Operator Portal
            </a>
          </div>
        </motion.div>

        <button onClick={() => navigate(-1)}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-gray-600 hover:text-gray-400 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    </div>
  );
}
