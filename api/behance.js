import { createClient } from "@supabase/supabase-js";
import requestIp from "request-ip";
import geoip from "geoip-lite";
import UAParser from "ua-parser-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  try {
    const ip =
      requestIp.getClientIp(req) || req.headers["x-forwarded-for"] || "unknown";
    const geo = geoip.lookup(ip) || {};
    const ua = new UAParser(req.headers["user-agent"] || "");

    const payload = {
      time: new Date().toISOString(),
      ip,
      city: geo.city || null,
      country: geo.country || null,
      device: `${ua.getDevice().type || "desktop"} - ${ua.getOS().name || ""} ${
        ua.getOS().version || ""
      }`.trim(),
      browser: `${ua.getBrowser().name || ""} ${
        ua.getBrowser().version || ""
      }`.trim(),
      referrer: req.headers.referer || "Direct",
    };

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
