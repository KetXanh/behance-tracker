import fs from "fs";

export default function handler(req, res) {
  let clicks = [];
  try {
    clicks = JSON.parse(fs.readFileSync("/tmp/clicks.json", "utf8"));
  } catch (e) {}

  let html = `
    <h1>Behance Click Tracker (VN)</h1>
    <p><b>Tổng: ${clicks.length} lượt bấm</b></p>
    <table border="1" cellpadding="5">
      <tr><th>Thời gian</th><th>Thành phố</th><th>Thiết bị</th><th>Nguồn</th></tr>
  `;

  clicks
    .slice(-20)
    .reverse()
    .forEach((c) => {
      html += `<tr><td>${c.time}</td><td>${c.city}</td><td>${c.device}</td><td>${c.referrer}</td></tr>`;
    });

  html += `</table><hr><small>© 2025 - Vercel</small>`;
  res.send(html);
}
