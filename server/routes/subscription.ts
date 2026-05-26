import { RequestHandler } from "express";

const LOGIN_API = "http://168.144.122.72/prod/CPLogin/CMMTN";
const PID       = "1";

// Proxy: GET /api/login?msisdn={msisdn}
// Calls CM MTN API server-side to avoid CORS
export const handleLogin: RequestHandler = async (req, res) => {
  const msisdn = (req.query.msisdn || req.query.subid) as string;
  if (!msisdn) return res.status(400).json({ response: "INACTIVE", error: "Missing msisdn" });

  try {
    const r    = await fetch(`${LOGIN_API}?pid=${PID}&msisdn=${encodeURIComponent(msisdn)}`);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ response: "ERROR", error: "Failed to reach login server" });
  }
};
