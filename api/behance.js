import geoip from "geoip-lite";
import uaParser from "ua-parser-js";
import requestIp from "request-ip";

// Log lưu memory
let clicks = [];

export default function handler(req, res) {
  const ip = requestIp.getClientIp(req) || "Unknown";
  const geo = geoip.lookup(ip) || {};
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

  // Redirect tới Behance
  res.writeHead(302, { Location: "https://www.behance.net/" });
  res.end();
}

// Export clicks để stats dùng
export { clicks };
