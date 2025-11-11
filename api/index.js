import fs from "fs";

export default function handler(req, res) {
  let clicks = [];
  try {
    clicks = JSON.parse(fs.readFileSync("/tmp/clicks.json", "utf8"));
  } catch (e) {}

  let html = `
    <h1>Behance Click Tracker</h1>
    <p><b>Tổng số: ${clicks.length} lượt click</b></p>
    <table border="1" cellpadding="6" cellspacing="0">
      <tr><th>Thời gian</th><th>Thành phố</th><th>Thiết bị</th><th>Nguồn</th></tr>
  `;

  clicks
    .slice(-20)
    .reverse()
    .forEach((c) => {
      html += `<tr><td>${c.time}</td><td>${c.city}</td><td>${c.device}</td><td>${c.referrer}</td></tr>`;
    });

  html += `</table><hr><small>© ${new Date().getFullYear()}</small>`;
  res.send(html);
}
