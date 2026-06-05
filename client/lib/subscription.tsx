import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const LOGIN_API = "/api/login";

export interface SubDetail {
  msisdn:     string;
  actDate:    string;
  renewDate:  string;
  pricePoint: string;
  validity:   string;
  unsubUrl:   string;
}

interface SubscriptionContextType {
  msisdn:       string | null;
  isSubscribed: boolean | null;
  isLoggedIn:   boolean;
  detail:       SubDetail | null;
  login:        (phone: string) => Promise<{ success: boolean; msg: string }>;
  logout:       () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  msisdn: null, isSubscribed: null, isLoggedIn: false, detail: null,
  login:  async () => ({ success: false, msg: "" }),
  logout: () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

// Add 237 country code if not present
const normalise = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("237") ? digits : `237${digits}`;
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [msisdn,       setMsisdn]       = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [isLoggedIn,   setIsLoggedIn]   = useState<boolean>(false);
  const [detail,       setDetail]       = useState<SubDetail | null>(null);

  useEffect(() => {
    const params    = new URLSearchParams(window.location.search);
    // Operator sends msisdn WITHOUT country code after subscription
    const urlMsisdn = params.get("msisdn") || params.get("subid");
    const saved     = sessionStorage.getItem("msisdn"); // already has 237

    if (urlMsisdn) {
      // User came from operator portal after subscribing
      // Add 237 and save immediately to cache
      const cleaned = normalise(urlMsisdn);
      sessionStorage.setItem("msisdn", cleaned); // save WITH 237
      // Clean URL immediately
      const lang = sessionStorage.getItem("lang") || "fr";
      window.history.replaceState({}, "", lang === "en" ? "/en" : "/fr");
      // Grant access immediately
      setMsisdn(cleaned);
      setIsLoggedIn(true);
      setIsSubscribed(true);
      // Verify + fetch detail in background
      fetchDetail(cleaned);
    } else if (saved) {
      // Returning user — msisdn already in sessionStorage WITH 237
      setMsisdn(saved);
      setIsLoggedIn(true);
      setIsSubscribed(true);
      // Verify in background
      fetchDetail(saved);
    } else {
      // No msisdn anywhere — guest user
      setIsSubscribed(false);
    }
  }, []);

  // Call API in background to get detail & verify
  const fetchDetail = async (cleaned: string) => {
    try {
      const res  = await fetch(`${LOGIN_API}?pid=1&msisdn=${encodeURIComponent(cleaned)}`);
      const text = await res.text();
      const data = JSON.parse(text);

      if (data.response === "ACTIVE") {
        setDetail({
          msisdn:     cleaned,
          actDate:    data.actDate    || "",
          renewDate:  data.renewDate  || "",
          pricePoint: data.pricePoint || "",
          validity:   data.validity   || "",
          unsubUrl:   data.unsubUrl   || "",
        });
      } else {
        // Subscription expired/invalid — clear cache and revoke access
        sessionStorage.removeItem("msisdn");
        setMsisdn(null);
        setIsLoggedIn(false);
        setIsSubscribed(false);
        setDetail(null);
        if (data.redirectURL) window.location.href = data.redirectURL;
      }
    } catch {
      // Network error — keep access (fail open)
    }
  };

  // Manual login from login modal
  const login = async (phone: string): Promise<{ success: boolean; msg: string }> => {
    const cleaned = normalise(phone);
    if (cleaned.length < 12)
      return { success: false, msg: "Please enter a valid 9-digit phone number." };

    try {
      const res  = await fetch(`${LOGIN_API}?pid=1&msisdn=${encodeURIComponent(cleaned)}`);
      const text = await res.text();
      const data = JSON.parse(text);

      if (data.response === "ACTIVE") {
        sessionStorage.setItem("msisdn", cleaned); // save WITH 237
        setMsisdn(cleaned);
        setIsLoggedIn(true);
        setIsSubscribed(true);
        setDetail({
          msisdn:     cleaned,
          actDate:    data.actDate    || "",
          renewDate:  data.renewDate  || "",
          pricePoint: data.pricePoint || "",
          validity:   data.validity   || "",
          unsubUrl:   data.unsubUrl   || "",
        });
        return { success: true, msg: "Welcome back!" };
      } else {
        // INACTIVE — redirect to subscription page
        if (data.redirectURL) {
          window.location.href = data.redirectURL;
          return { success: true, msg: "Redirecting to subscription page..." };
        }
        return { success: false, msg: "You are not subscribed. Please subscribe to continue." };
      }
    } catch (e) {
      console.error("Login error:", e);
      return { success: false, msg: "Network error. Please check your connection and try again." };
    }
  };

  const logout = () => {
    sessionStorage.removeItem("msisdn");
    setMsisdn(null);
    setIsLoggedIn(false);
    setIsSubscribed(false);
    setDetail(null);
  };

  return (
    <SubscriptionContext.Provider value={{ msisdn, isSubscribed, isLoggedIn, detail, login, logout }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
