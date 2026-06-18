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
  msisdn:         string | null;
  isSubscribed:   boolean;
  isLoggedIn:     boolean;
  isChecking:     boolean;
  isInsufficient: boolean;
  detail:         SubDetail | null;
  activationUrl:  string | null;
  login:          (phone: string) => Promise<{ success: boolean; msg: string; insufficient?: boolean }>;
  logout:         () => void;
  goToActivation: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  msisdn: null, isSubscribed: false, isLoggedIn: false, isChecking: false,
  isInsufficient: false, detail: null, activationUrl: null,
  login:  async () => ({ success: false, msg: "" }),
  logout: () => {},
  goToActivation: () => {},
});

export const INSUFFICIENT_MSG = {
  en: "Y'ello! Dear Customer, we were unable to activate your service On Cook due to insufficient balance. Please recharge your account and try again.",
  fr: "Y'ello! Cher client, nous n'avons pas pu activer votre service On Cook en raison d'un solde insuffisant. Veuillez recharger votre compte et réessayer.",
};

export const useSubscription = () => useContext(SubscriptionContext);

const hasPendingCheck = () => {
  const params = new URLSearchParams(window.location.search);
  return !!(
    params.get("msisdn") || params.get("subid") || params.get("sid") ||
    sessionStorage.getItem("msisdn")
  );
};

export const useContentGate = () => {
  const { isSubscribed, isChecking } = useSubscription();

  const requestAccess = (handlers: {
    onGranted: () => void;
    onLogin:   () => void;
  }) => {
    if (isChecking) return;
    if (isSubscribed) handlers.onGranted();
    else handlers.onLogin();
  };

  return { requestAccess, isChecking };
};

const normalise = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("237") ? digits : `237${digits}`;
};

const cleanURL = () => {
  const lang = sessionStorage.getItem("lang") || "fr";
  window.history.replaceState({}, "", lang === "en" ? "/en" : "/fr");
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [msisdn,        setMsisdn]        = useState<string | null>(null);
  const [isSubscribed,  setIsSubscribed]    = useState(false);
  const [isLoggedIn,    setIsLoggedIn]      = useState(false);
  const [isChecking,    setIsChecking]      = useState(hasPendingCheck);
  const [detail,        setDetail]          = useState<SubDetail | null>(null);
  const [activationUrl, setActivationUrl]   = useState<string | null>(
    () => sessionStorage.getItem("activationUrl")
  );
  const [isInsufficient, setIsInsufficient] = useState(
    () => sessionStorage.getItem("isInsufficient") === "1"
  );

  useEffect(() => {
    const params    = new URLSearchParams(window.location.search);
    const urlMsisdn = params.get("msisdn") || params.get("subid");
    const urlSid    = params.get("sid");
    const saved     = sessionStorage.getItem("msisdn");

    const runCheck = async () => {
      setIsChecking(true);

      if (urlMsisdn) {
        const cleaned = normalise(urlMsisdn);
        sessionStorage.setItem("msisdn", cleaned);
        setMsisdn(cleaned);
        if (urlSid) sessionStorage.setItem("sid", urlSid);
        cleanURL();
        await verifyByMsisdn(cleaned);
      } else if (urlSid) {
        sessionStorage.setItem("sid", urlSid);
        cleanURL();
        await verifyBySid(urlSid);
      } else if (saved) {
        setMsisdn(saved);
        await verifyByMsisdn(saved);
      }

      setIsChecking(false);
    };

    if (urlMsisdn || urlSid || saved) {
      runCheck();
    } else {
      setIsChecking(false);
      setIsSubscribed(false);
    }
  }, []);

  const applyDetail = (msisdnVal: string, data: any) => {
    const withCode = normalise(msisdnVal);
    sessionStorage.setItem("msisdn", withCode);
    sessionStorage.removeItem("activationUrl");
    sessionStorage.removeItem("isInsufficient");
    setActivationUrl(null);
    setIsInsufficient(false);
    setMsisdn(withCode);
    setIsLoggedIn(true);
    setIsSubscribed(true);
    setDetail({
      msisdn:     withCode,
      actDate:    data.actDate    || "",
      renewDate:  data.renewDate  || "",
      pricePoint: data.pricePoint || "",
      validity:   data.validity   || "",
      unsubUrl:   data.unsubUrl   || "",
    });
  };

  const markInactive = (redirectURL?: string) => {
    setIsInsufficient(false);
    sessionStorage.removeItem("isInsufficient");
    setIsLoggedIn(false);
    setIsSubscribed(false);
    setDetail(null);
    if (redirectURL) {
      sessionStorage.setItem("activationUrl", redirectURL);
      setActivationUrl(redirectURL);
    }
  };

  const markInsufficient = (redirectURL?: string) => {
    setIsLoggedIn(false);
    setIsSubscribed(false);
    setDetail(null);
    setIsInsufficient(true);
    sessionStorage.setItem("isInsufficient", "1");
    if (redirectURL) {
      sessionStorage.setItem("activationUrl", redirectURL);
      setActivationUrl(redirectURL);
    }
  };

  const handleInsufficient = (data: { response?: string; redirectURL?: string }) => {
    if (data.response === "INSUFFICIENT") {
      markInsufficient(data.redirectURL);
      return true;
    }
    return false;
  };

  const verifyByMsisdn = async (cleaned: string) => {
    try {
      const res  = await fetch(`${LOGIN_API}?pid=1&msisdn=${encodeURIComponent(cleaned)}`);
      const data = JSON.parse(await res.text());
      if (data.response === "ACTIVE") {
        applyDetail(cleaned, data);
      } else if (handleInsufficient(data)) {
        return;
      } else {
        markInactive(data.redirectURL);
      }
    } catch { /* stay on portal */ }
  };

  const verifyBySid = async (sid: string) => {
    try {
      const res  = await fetch(`${LOGIN_API}?pid=1&sid=${encodeURIComponent(sid)}`);
      const data = JSON.parse(await res.text());
      if (data.response === "ACTIVE") {
        const match    = (data.unsubUrl || "").match(/msisdn=(\d+)/);
        const m        = match ? match[1] : "";
        const withCode = m ? normalise(m) : "";
        if (withCode) {
          sessionStorage.setItem("msisdn", withCode);
          setMsisdn(withCode);
        }
        sessionStorage.removeItem("activationUrl");
        sessionStorage.removeItem("isInsufficient");
        setActivationUrl(null);
        setIsInsufficient(false);
        setIsLoggedIn(true);
        setIsSubscribed(true);
        setDetail({
          msisdn:     withCode || sid,
          actDate:    data.actDate    || "",
          renewDate:  data.renewDate  || "",
          pricePoint: data.pricePoint || "",
          validity:   data.validity   || "",
          unsubUrl:   data.unsubUrl   || "",
        });
      } else if (handleInsufficient(data)) {
        return;
      } else {
        markInactive(data.redirectURL);
      }
    } catch { /* stay on portal */ }
  };

  const login = async (phone: string): Promise<{ success: boolean; msg: string; insufficient?: boolean }> => {
    const cleaned = normalise(phone);
    if (cleaned.length < 12)
      return { success: false, msg: "Please enter a valid 9-digit phone number." };

    try {
      const res  = await fetch(`${LOGIN_API}?pid=1&msisdn=${encodeURIComponent(cleaned)}`);
      const data = JSON.parse(await res.text());

      if (data.response === "ACTIVE") {
        applyDetail(cleaned, data);
        return { success: true, msg: "Welcome back!" };
      }

      if (handleInsufficient(data)) {
        sessionStorage.setItem("msisdn", cleaned);
        setMsisdn(cleaned);
        const lang = sessionStorage.getItem("lang") || "fr";
        return {
          success: false,
          insufficient: true,
          msg: INSUFFICIENT_MSG[lang === "en" ? "en" : "fr"],
        };
      }

      sessionStorage.setItem("msisdn", cleaned);
      setMsisdn(cleaned);
      markInactive(data.redirectURL);
      const lang = sessionStorage.getItem("lang") || "fr";
      return {
        success: false,
        msg: lang === "en"
          ? "Your subscription is not active. Click any video to activate."
          : "Votre abonnement n'est pas actif. Cliquez sur n'importe quelle vidéo pour activer.",
      };
    } catch (e) {
      console.error("Login error:", e);
      return { success: false, msg: "Network error. Please check your connection and try again." };
    }
  };

  const logout = () => {
    sessionStorage.removeItem("msisdn");
    sessionStorage.removeItem("sid");
    sessionStorage.removeItem("activationUrl");
    sessionStorage.removeItem("isInsufficient");
    setMsisdn(null);
    setIsLoggedIn(false);
    setIsSubscribed(false);
    setDetail(null);
    setActivationUrl(null);
    setIsInsufficient(false);
  };

  const goToActivation = () => {
    if (activationUrl) window.location.href = activationUrl;
  };

  return (
    <SubscriptionContext.Provider
      value={{ msisdn, isSubscribed, isLoggedIn, isChecking, isInsufficient, detail, activationUrl, login, logout, goToActivation }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
