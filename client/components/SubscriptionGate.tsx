import { motion } from "framer-motion";
import { useSubscription } from "@/lib/subscription";

export const SubscriptionGate = ({ children }: { children: React.ReactNode }) => {
  const { isSubscribed, isLoggedIn } = useSubscription();

  // Checking subscription status
  if (isLoggedIn && isSubscribed === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div className="flex flex-col items-center gap-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <img src="/logo/logo (1).png" alt="OnCook" className="h-16 w-auto object-contain" />
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div key={i} className="w-2 h-2 bg-red-500 rounded-full"
                animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
          <p className="text-gray-600 text-xs">Checking subscription...</p>
        </motion.div>
      </div>
    );
  }

  // Not logged in + not subscribed → show content (login modal handles access)
  return <>{children}</>;
};
