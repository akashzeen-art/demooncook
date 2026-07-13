import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const LOGIN_API = "/api/login";
const UNSUB_API = "/api/unsub";
const LOGIN_PID = "9";
const UNSUB_CP  = "1";
const UNSUB_PID = "9";
export const LANDING_URL = "http://168.144.122.72/prod/LP/landing?creatid=1&hash=CMMTN";

export interface SubDetail {
  msisdn:     string;
  actDate:    string;
  renewDate:  string;
  pricePoint: string;
  validity:   string;
  unsubUrl:   string;
}

export interface LoginApiResponse {
  response:    string;
  redirectURL?: string;
  actDate?:    string;
  renewDate?:  string;
  pricePoint?: string;
  validity?:   string;
  unsubUrl?:   string;
}

interface SubscriptionContextType {
  msisdn:         string | null;
  isSubscribed:   boolean;
  isLoggedIn:     boolean;
  isChecking:     boolean;
  isInsufficient: boolean;
  isInactive:     boolean;
  detail:         SubDetail | null;
  activationUrl:  string | null;
  rechargeUrl:    string | null;
  login:          (phone: string) => Promise<{ success: boolean; msg: string; insufficient?: boolean }>;
  unsubscribe:    () => Promise<{ success: boolean; msg: string }>;
  logout:         () => void;
  goToActivation: () => void;
  goToRecharge:   () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  msisdn: null, isSubscribed: false, isLoggedIn: false, isChecking: false,
  isInsufficient: false, isInactive: false, detail: null, activationUrl: null, rechargeUrl: null,
  login:  async () => ({ success: false, msg: "" }),
  unsubscribe: async () => ({ success: false, msg: "" }),
  logout: () => {},
  goToActivation: () => {},
  goToRecharge: () => {},
});

export const INSUFFICIENT_MSG = {
  en: "Y'ello! Dear Customer, we were unable to activate your service On Cook due to insufficient balance.\nPlease recharge your account and try again.",
  fr: "Y'ello! Cher client, nous n'avons pas pu activer votre service On Cook en raison d'un solde insuffisant.\nVeuillez recharger votre compte et réessayer.",
};

export const INACTIVE_MSG = {
  en: "Your subscription is not active. Click below to activate.",
  fr: "Votre abonnement n'est pas actif. Cliquez ci-dessous pour activer.",
};

export const UNSUB_SUCCESS_MSG = {
  en: "You have successfully unsubscribed from On Cook jour service.",
  fr: "Vous vous êtes désabonné avec succès du service On Cook jour.",
};

const isUnsubSuccess = (response?: string) => {
  const r = (response || "").toUpperCase().trim();
  return r === "SUCCECSS" || r === "SUCCESS";
};

const parseUnsubResponse = (text: string) => {
  const trimmed = text.trim();
  if (trimmed.startsWith("<!") || trimmed.startsWith("<html")) {
    throw new Error("Unsubscribe API returned HTML instead of JSON");
  }
  const data = JSON.parse(trimmed) as { response?: string; errorMessage?: string };
  return {
    response:     typeof data.response === "string" ? data.response.toUpperCase().trim() : "",
    errorMessage: data.errorMessage || "",
  };
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
  const { isSubscribed, isChecking, isInsufficient, isInactive } = useSubscription();

  const requestAccess = (handlers: {
    onGranted: () => void;
    onLogin:   () => void;
  }) => {
    if (isChecking) return;
    if (isSubscribed && !isInsufficient && !isInactive) handlers.onGranted();
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

const isFromLanding = () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("creatid") || params.get("hash")) return true;
  try {
    const ref = document.referrer;
    return ref.includes("/LP/landing") || ref.includes("/prod/LP/landing");
  } catch {
    return false;
  }
};

const parseLoginResponse = (text: string): LoginApiResponse => {
  const data = JSON.parse(text.trim()) as LoginApiResponse;
  return {
    ...data,
    response:    typeof data.response === "string" ? data.response.toUpperCase().trim() : "",
    redirectURL: data.redirectURL || (data as { redirectUrl?: string }).redirectUrl,
  };
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
  const [rechargeUrl, setRechargeUrl]       = useState<string | null>(
    () => sessionStorage.getItem("rechargeUrl")
  );
  const [isInsufficient, setIsInsufficient] = useState(
    () => sessionStorage.getItem("isInsufficient") === "1"
  );
  const [isInactive, setIsInactive] = useState(
    () => sessionStorage.getItem("isInactive") === "1"
  );

  useEffect(() => {
    const params    = new URLSearchParams(window.location.search);
    const urlMsisdn = params.get("msisdn") || params.get("subid");
    const urlSid    = params.get("sid");
    const saved     = sessionStorage.getItem("msisdn");
    const fromLanding = isFromLanding();

    const runCheck = async () => {
      setIsChecking(true);
      setIsSubscribed(false);
      setIsLoggedIn(false);
      sessionStorage.removeItem("isInactive");
      sessionStorage.removeItem("isInsufficient");
      sessionStorage.removeItem("activationUrl");
      sessionStorage.removeItem("rechargeUrl");
      setIsInactive(false);
      setIsInsufficient(false);
      setActivationUrl(null);
      setRechargeUrl(null);
      setDetail(null);

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

    if (urlMsisdn || urlSid || saved || fromLanding) {
      runCheck();
    } else {
      setIsChecking(false);
      setIsSubscribed(false);
    }

    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      const stored = sessionStorage.getItem("msisdn");
      const sid    = sessionStorage.getItem("sid");
      if (stored || sid) runCheck();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const applyDetail = (msisdnVal: string, data: any) => {
    const withCode = normalise(msisdnVal);
    sessionStorage.setItem("msisdn", withCode);
    sessionStorage.removeItem("activationUrl");
    sessionStorage.removeItem("rechargeUrl");
    sessionStorage.removeItem("isInsufficient");
    sessionStorage.removeItem("isInactive");
    setActivationUrl(null);
    setRechargeUrl(null);
    setIsInsufficient(false);
    setIsInactive(false);
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
    sessionStorage.removeItem("rechargeUrl");
    setRechargeUrl(null);
    setIsInactive(true);
    sessionStorage.setItem("isInactive", "1");
    setIsLoggedIn(false);
    setIsSubscribed(false);
    setDetail(null);
    if (redirectURL) {
      sessionStorage.setItem("activationUrl", redirectURL);
      setActivationUrl(redirectURL);
    }
  };

  const markInsufficient = (redirectURL?: string) => {
    const url = redirectURL || LANDING_URL;
    setIsInactive(false);
    sessionStorage.removeItem("isInactive");
    setIsLoggedIn(false);
    setIsSubscribed(false);
    setDetail(null);
    setIsInsufficient(true);
    sessionStorage.setItem("isInsufficient", "1");
    sessionStorage.removeItem("activationUrl");
    setActivationUrl(null);
    sessionStorage.setItem("rechargeUrl", url);
    setRechargeUrl(url);
  };

  const handleInsufficient = (data: LoginApiResponse) => {
    if (data.response === "INSUFFICIENT") {
      markInsufficient(data.redirectURL);
      return true;
    }
    return false;
  };

  const verifyByMsisdn = async (cleaned: string) => {
    try {
      const res  = await fetch(`${LOGIN_API}?pid=${LOGIN_PID}&msisdn=${encodeURIComponent(cleaned)}`);
      const data = parseLoginResponse(await res.text());
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
      const res  = await fetch(`${LOGIN_API}?pid=${LOGIN_PID}&sid=${encodeURIComponent(sid)}`);
      const data = parseLoginResponse(await res.text());
      if (data.response === "ACTIVE") {
        const match    = (data.unsubUrl || "").match(/msisdn=(\d+)/);
        const m        = match ? match[1] : "";
        const withCode = m ? normalise(m) : "";
        if (withCode) {
          sessionStorage.setItem("msisdn", withCode);
          setMsisdn(withCode);
        }
        sessionStorage.removeItem("activationUrl");
        sessionStorage.removeItem("rechargeUrl");
        sessionStorage.removeItem("isInsufficient");
        sessionStorage.removeItem("isInactive");
        setActivationUrl(null);
        setRechargeUrl(null);
        setIsInsufficient(false);
        setIsInactive(false);
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
      const res  = await fetch(`${LOGIN_API}?pid=${LOGIN_PID}&msisdn=${encodeURIComponent(cleaned)}`);
      const data = parseLoginResponse(await res.text());

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
        msg: INACTIVE_MSG[lang === "en" ? "en" : "fr"],
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
    sessionStorage.removeItem("rechargeUrl");
    sessionStorage.removeItem("isInsufficient");
    sessionStorage.removeItem("isInactive");
    setMsisdn(null);
    setIsLoggedIn(false);
    setIsSubscribed(false);
    setDetail(null);
    setActivationUrl(null);
    setRechargeUrl(null);
    setIsInsufficient(false);
    setIsInactive(false);
  };

  const unsubscribe = async (): Promise<{ success: boolean; msg: string }> => {
    const phone = msisdn || detail?.msisdn;
    const lang  = sessionStorage.getItem("lang") || "fr";

    if (!phone) {
      return {
        success: false,
        msg: lang === "en" ? "No mobile number found." : "Aucun numéro de mobile trouvé.",
      };
    }

    try {
      const cleaned = normalise(phone);
      const res     = await fetch(
        `${UNSUB_API}?cp=${UNSUB_CP}&pid=${UNSUB_PID}&msisdn=${encodeURIComponent(cleaned)}`,
      );
      const data = parseUnsubResponse(await res.text());

      if (isUnsubSuccess(data.response)) {
        logout();
        return {
          success: true,
          msg: data.errorMessage || UNSUB_SUCCESS_MSG[lang === "en" ? "en" : "fr"],
        };
      }

      return {
        success: false,
        msg: data.errorMessage || (lang === "en"
          ? "Service Deactivation Failed"
          : "Échec de la désactivation du service"),
      };
    } catch (e) {
      console.error("Unsubscribe error:", e);
      const isHtmlResponse = e instanceof Error && e.message.includes("HTML instead of JSON");
      return {
        success: false,
        msg: isHtmlResponse
          ? (lang === "en"
            ? "Unsubscribe API is not configured on the server. Ask your admin to reload nginx with the /api/unsub proxy."
            : "L'API de désabonnement n'est pas configurée sur le serveur. Demandez à l'administrateur de recharger nginx avec le proxy /api/unsub.")
          : (lang === "en"
            ? "Network error. Please try again."
            : "Erreur réseau. Veuillez réessayer."),
      };
    }
  };

  const goToActivation = () => {
    if (activationUrl) window.location.href = activationUrl;
  };

  const goToRecharge = () => {
    const url = rechargeUrl || LANDING_URL;
    window.location.href = url;
  };

  return (
    <SubscriptionContext.Provider
      value={{
        msisdn, isSubscribed, isLoggedIn, isChecking, isInsufficient, isInactive,
        detail, activationUrl, rechargeUrl,
        login, unsubscribe, logout, goToActivation, goToRecharge,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
