import { motion } from "framer-motion";
import { Lock, Play } from "lucide-react";
import { useSubscription } from "@/lib/subscription";

export const Paywall = () => {
  const { login } = useSubscription();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0">
        <img src="/COOKING/i2.jpg" alt="" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
      </div>
      <motion.div className="absolute w-[500px] h-[500px] rounded-full bg-red-600/10 blur-[120px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md gap-6">
        <motion.div className="flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <img src="/logo/logo (1).png" alt="On Cook" className="h-20 w-auto" />
          <span className="oncook-brand text-2xl"><span className="brand-O">O</span>n<span className="brand-C">C</span>ook</span>
        </motion.div>

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 bg-red-600/20 border border-red-500/40 rounded-full flex items-center justify-center">
          <Lock className="w-9 h-9 text-red-400" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-3">
          <h1 className="text-3xl font-cinematic text-white">Subscribe to Watch</h1>
          <p className="text-gray-400 text-sm leading-relaxed">Your account is not subscribed. Subscribe now to unlock all culinary content.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="grid gap-3 w-full">
          {["🌍 7 World Cuisine Categories", "🎬 HD Video Streaming", "🇫🇷 French & English Content"].map(f => (
            <div key={f} className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-left">
              <span className="text-gray-300 text-sm">{f}</span>
            </div>
          ))}
        </motion.div>

        <motion.a
          href="#"
          onClick={(e) => { e.preventDefault(); login(""); }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/30"
        >
          <Play className="w-5 h-5 fill-white" /> Subscribe Now
        </motion.a>
      </div>
    </div>
  );
};
