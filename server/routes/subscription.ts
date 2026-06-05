import { RequestHandler } from "express";

const LOGIN_API = "http://168.144.122.72/prod/CPLogin/CMMTN";
const PID       = "1";

export const handleLogin: RequestHandler = async (req, res) => {
  const msisdn = req.query.msisdn as string;
  const sid    = req.query.sid    as string;

  if (!msisdn && !sid) {
    return res.status(400).json({ response: "ERROR", error: "Missing msisdn or sid" });
  }

  try {
    const param = msisdn
      ? `msisdn=${encodeURIComponent(msisdn)}`
      : `sid=${encodeURIComponent(sid)}`;

    const r    = await fetch(`${LOGIN_API}?pid=${PID}&${param}`);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ response: "ERROR", error: "Failed to reach login server" });
  }
};
