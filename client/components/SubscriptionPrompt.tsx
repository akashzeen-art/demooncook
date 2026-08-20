import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSubscription } from "@/lib/subscription";
import { LoginModal } from "@/components/LoginModal";
import { useLocation } from "react-router-dom";

/** Auto-opens login modal after URL/session check when user is not subscribed. FR only. */
export const SubscriptionPrompt = () => {
  const { isInsufficient, isInactive, isChecking, isSubscribed } = useSubscription();
  const [show, setShow]       = useState(false);
  const hasAutoPrompted       = useRef(false);
  const location              = useLocation();

  // Only show on FR routes, never on EN
  const isEnRoute = location.pathname === "/en" || location.pathname === "/";

  useEffect(() => {
    if (isEnRoute) return;
    if (!isChecking && !isSubscribed && !hasAutoPrompted.current && (isInsufficient || isInactive)) {
      hasAutoPrompted.current = true;
      setShow(true);
    }
  }, [isChecking, isInsufficient, isInactive, isSubscribed, isEnRoute]);

  if (!show) return null;

  return createPortal(
    <LoginModal onClose={() => setShow(false)} />,
    document.body,
  );
};
