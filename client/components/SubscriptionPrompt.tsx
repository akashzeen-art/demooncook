import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSubscription } from "@/lib/subscription";
import { LoginModal } from "@/components/LoginModal";

/** Auto-opens login modal after URL/session check when user is not subscribed. */
export const SubscriptionPrompt = () => {
  const { isInsufficient, isInactive, isChecking, isSubscribed } = useSubscription();
  const [show, setShow]             = useState(false);
  const hasAutoPrompted               = useRef(false);

  useEffect(() => {
    if (!isChecking && !isSubscribed && !hasAutoPrompted.current && (isInsufficient || isInactive)) {
      hasAutoPrompted.current = true;
      setShow(true);
    }
  }, [isChecking, isInsufficient, isInactive, isSubscribed]);

  if (!show) return null;

  return createPortal(
    <LoginModal onClose={() => setShow(false)} />,
    document.body,
  );
};
