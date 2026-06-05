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

const normalise = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("237") ? digits : `237${digits}`;
};

const cleanURL = () => {
  const lang = sessionStorage.getItem("lang") || "fr";
  window.history.replaceState({}, "", lang === "en" ? "/en" : "/fr");
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [msisdn,       setMsisdn]       = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [isLoggedIn,   setIsLoggedIn]   = useState<boolean>(false);
  const [detail,       setDetail]       = useState<SubDetail | null>(null);

  useEffect(() => {
    const params    = new URLSearchParams(window.location.search);
    const urlMsisdn = params.get("msisdn") || params.get("subid");
    const urlSid    = params.get("sid");
    const saved     = sessionStorage.getItem("msisdn");

    if (urlMsisdn) {
      // ?msisdn= or ?subid= in URL — add 237 and grant access immediately
      const cleaned = normalise(urlMsisdn);
      sessionStorage.setItem("msisdn", cleaned);
      setMsisdn(cleaned);
      setIsLoggedIn(true);
      setIsSubscribed(true);
      cleanURL();
      fetchDetailByMsisdn(cleaned);

    } else if (urlSid) {
      // ?sid= in URL — operator sends session ID after subscription
      // Grant access immediately, verify + get msisdn in background
      sessionStorage.setItem("sid", urlSid);
      setIsLoggedIn(true);
      setIsSubscribed(true);
      cleanURL();
      fetchDetailBySid(urlSid);

    } else if (saved) {
      // Returning user — msisdn in sessionStorage
      setMsisdn(saved);
      setIsLoggedIn(true);
      setIsSubscribed(true);
      fetchDetailByMsisdn(saved);

    } else {
      setIsSubscribed(false);
    }
  }, []);

  const applyDetail = (msisdnVal: string, data: any) => {
    const withCode = normalise(msisdnVal);
    sessionStorage.setItem("msisdn", withCode);
    setMsisdn(withCode);
    setDetail({
      msisdn:     withCode,
      actDate:    data.actDate    || "",
      renewDate:  data.renewDate  || "",
      pricePoint: data.pricePoint || "",
      validity:   data.validity   || "",
      unsubUrl:   data.unsubUrl   || "",
    });
  };

  const revokeAccess = (redirectURL?: string) => {
    sessionStorage.removeItem("msisdn");
    sessionStorage.removeItem("sid");
    setMsisdn(null);
    setIsLoggedIn(false);
    setIsSubscribed(false);
    setDetail(null);
    if (redirectURL) window.location.href = redirectURL;
  };

  const fetchDetailByMsisdn = async (cleaned: string) => {
    try {
      const res  = await fetch(`${LOGIN_API}?pid=1&msisdn=${encodeURIComponent(cleaned)}`);
      const data = JSON.parse(await res.text());
      if (data.response === "ACTIVE") {
        applyDetail(cleaned, data);
      } else {
        revokeAccess(data.redirectURL);
      }
    } catch { /* fail open */ }
  };

  const fetchDetailBySid = async (sid: string) => {
    try {
      const res  = await fetch(`${LOGIN_API}?pid=1&sid=${encodeURIComponent(sid)}`);
      const data = JSON.parse(await res.text());
      if (data.response === "ACTIVE") {
        // Extract msisdn from unsubUrl if present e.g. unsub?pid=1&msisdn=237...
        const match = (data.unsubUrl || "").match(/msisdn=(\d+)/);
        const m     = match ? match[1] : "";
        const withCode = m ? normalise(m) : "";
        if (withCode) {
          sessionStorage.setItem("msisdn", withCode);
          setMsisdn(withCode);
        }
        setDetail({
          msisdn:     withCode || sid,
          actDate:    data.actDate    || "",
          renewDate:  data.renewDate  || "",
          pricePoint: data.pricePoint || "",
          validity:   data.validity   || "",
          unsubUrl:   data.unsubUrl   || "",
        });
      } else {
        revokeAccess(data.redirectURL);
      }
    } catch { /* fail open */ }
  };

  const login = async (phone: string): Promise<{ success: boolean; msg: string }> => {
    const cleaned = normalise(phone);
    if (cleaned.length < 12)
      return { success: false, msg: "Please enter a valid 9-digit phone number." };

    try {
      const res  = await fetch(`${LOGIN_API}?pid=1&msisdn=${encodeURIComponent(cleaned)}`);
      const data = JSON.parse(await res.text());

      if (data.response === "ACTIVE") {
        sessionStorage.setItem("msisdn", cleaned);
        setMsisdn(cleaned);
        setIsLoggedIn(true);
        setIsSubscribed(true);
        applyDetail(cleaned, data);
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
    sessionStorage.removeItem("sid");
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
