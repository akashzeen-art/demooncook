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

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [msisdn,       setMsisdn]       = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [isLoggedIn,   setIsLoggedIn]   = useState<boolean>(false);
  const [detail,       setDetail]       = useState<SubDetail | null>(null);

  useEffect(() => {
    const params      = new URLSearchParams(window.location.search);
    // Operator portal sends msisdn WITHOUT country code e.g. ?msisdn=206443329 or ?subid=206443329
    const urlMsisdn   = params.get("msisdn") || params.get("subid");
    const saved       = sessionStorage.getItem("msisdn");
    const fromPortal  = !!(urlMsisdn);

    if (urlMsisdn) {
      // Coming from operator portal after subscription
      checkLogin(urlMsisdn, fromPortal);
    } else if (saved) {
      // Returning user — already saved in sessionStorage
      checkLogin(saved, false);
    } else {
      setIsSubscribed(false);
    }
  }, []);

  // Always ensure 237 country code is present
  const normalise = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return digits.startsWith("237") ? digits : `237${digits}`;
  };

  const applyActive = (cleaned: string, data: any, fromPortal = false) => {
    // Save msisdn WITH country code to sessionStorage
    sessionStorage.setItem("msisdn", cleaned);
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

    // If coming from portal, clean URL params and redirect to content
    if (fromPortal) {
      const lang = sessionStorage.getItem("lang") || "fr";
      const path = lang === "en" ? "/en" : "/fr";
      // Replace URL without params so msisdn isn't visible in address bar
      window.history.replaceState({}, "", path);
    }
  };

  const callAPI = async (msisdn: string) => {
    const res  = await fetch(`${LOGIN_API}?pid=1&msisdn=${encodeURIComponent(msisdn)}`);
    const text = await res.text();
    return JSON.parse(text);
  };

  const checkLogin = async (phone: string, fromPortal = false) => {
    const cleaned = normalise(phone);
    try {
      const data = await callAPI(cleaned);
      if (data.response === "ACTIVE") {
        applyActive(cleaned, data, fromPortal);
      } else {
        setIsSubscribed(false);
        // Only redirect to subscription page if coming from portal
        if (fromPortal && data.redirectURL) {
          window.location.href = data.redirectURL;
        }
      }
    } catch {
      // On network error, fall open if already saved
      const saved = sessionStorage.getItem("msisdn");
      if (saved) {
        setMsisdn(saved);
        setIsLoggedIn(true);
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
      }
    }
  };

  const login = async (phone: string): Promise<{ success: boolean; msg: string }> => {
    const cleaned = normalise(phone);
    if (cleaned.length < 12)
      return { success: false, msg: "Please enter a valid 9-digit phone number." };

    try {
      const data = await callAPI(cleaned);
      if (data.response === "ACTIVE") {
        applyActive(cleaned, data, false);
        return { success: true, msg: "Welcome back!" };
      } else {
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
