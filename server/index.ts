import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleLogin, handleUnsub } from "./routes/subscription";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/api/ping", (_req, res) => {
    res.json({ message: process.env.PING_MESSAGE ?? "ping" });
  });

  // CM MTN Login proxy — avoids CORS on frontend
  app.get("/api/login", handleLogin);
  app.get("/api/unsub", handleUnsub);

  return app;
}
