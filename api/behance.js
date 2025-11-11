// api/behance.js
import geoip from "geoip-lite";
import uaParser from "ua-parser-js";
import requestIp from "request-ip";

let clicks = []; // dùng memory vì fs không dùng được trên Vercel

export default function handler(req, res) {
  // Lấy IP
  const ip = requestIp.getClientIp(req) || "Unknown";

  // Geo info
  const geo = geoip.lookup(ip) || {};

  // User agent
  const ua = uaParser(req.headers["user-agent"] || "");

  const log = {
    time: new Date().toLocaleString("vi-VN"),
    ip,
    city: geo.city || "Unknown",
    country: geo.country || "VN",
    device: `${ua.device.type || "desktop"} - ${ua.os.name || ""} ${
      ua.os.version || ""
    }`,
    browser: `${ua.browser.name || ""} ${ua.browser.version || ""}`,
    referrer: req.headers["referer"] || "Direct",
  };

  clicks.push(log);

  // Redirect
  res.writeHead(302, { Location: "https://www.behance.net/" });
  res.end();
}
