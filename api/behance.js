import { createClient } from "@supabase/supabase-js";
import requestIp from "request-ip";
import geoip from "geoip-lite";
import UAParser from "ua-parser-js";


const supabase = createClient(
  "https://mvctquugijeqhosuctwz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12Y3RxdXVnaWplcWhvc3VjdHd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NzgyMjQsImV4cCI6MjA3ODQ1NDIyNH0.ZSrmsmKx5j5DsNpe8KDF7TnLr2OlaoYYnJKq0lnOGMo"
);

export default async function handler(req, res) {
  try {
    // Lấy IP client
    const ip =
      requestIp.getClientIp(req) || req.headers["x-forwarded-for"] || "unknown";

    // Lấy geo info từ IP
    const geo = geoip.lookup(ip) || {};

    // Lấy thông tin trình duyệt, thiết bị
    const ua = new UAParser(req.headers["user-agent"] || "");

    // Payload để ghi vào Supabase
    const payload = {
      time: new Date().toISOString(),
      ip,
      city: geo.city || null,
      device: `${ua.getDevice().type || "desktop"} - ${ua.getOS().name || ""} ${
        ua.getOS().version || ""
      }`.trim(),
      browser: `${ua.getBrowser().name || ""} ${
        ua.getBrowser().version || ""
      }`.trim(),
      referrer: req.headers.referer || "Direct",
    };

    // Ghi vào table "clicks"
    const { error } = await supabase.from("clicks").insert([payload]);
    if (error) console.error("Supabase insert error:", error);

  
    res.writeHead(302, { Location: "https://www.behance.net/" });
    res.end();
  } catch (err) {
    console.error("behance handler error:", err);
    res.writeHead(302, { Location: "https://www.behance.net/" });
    res.end();
  }
}
