import { RequestHandler } from "express";
import type { UnsubApiResponse } from "@shared/api";

const LOGIN_API = "http://168.144.122.72/prod/CPLogin/CMMTN";
const UNSUB_API = "http://168.144.122.72/prod/CMMTN/unsub";
const PID       = "1";
const CP        = "1";

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

export const handleUnsub: RequestHandler = async (req, res) => {
  const msisdn = req.query.msisdn as string;

  if (!msisdn) {
    return res.status(400).json({ response: "FAIL", errorMessage: "Missing msisdn" });
  }

  try {
    const r    = await fetch(`${UNSUB_API}?cp=${CP}&pid=${PID}&msisdn=${encodeURIComponent(msisdn)}`);
    const data = (await r.json()) as UnsubApiResponse;
    res.json(data);
  } catch {
    res.status(500).json({ response: "FAIL", errorMessage: "Failed to reach unsub server" });
  }
};
