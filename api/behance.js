import fs from "fs";
import requestIp from "request-ip";
import geoip from "geoip-lite";
import UAParser from "ua-parser-js";

let clicks = [];
try {
  clicks = JSON.parse(fs.readFileSync("/tmp/clicks.json", "utf8"));
} catch (e) {}

export default function handler(req, res) {
  const ip = requestIp.getClientIp(req);
  const geo = geoip.lookup(ip) || {};
  const ua = new UAParser(req.headers["user-agent"]).getResult();

  const log = {
    time: new Date().toLocaleString("vi-VN"),
    city: geo.city || "Unknown",
    device: `${ua.device.type || "desktop"} - ${ua.os.name || "Unknown"}`,
    referrer: req.headers.referer || "Direct",
  };

  clicks.push(log);
  fs.writeFileSync("/tmp/clicks.json", JSON.stringify(clicks, null, 2));

  res.redirect(302, "https://www.behance.net/");
}
