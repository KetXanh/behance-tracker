export default function handler(req, res) {
  res.setHeader("Content-Type", "text/html");

  // Demo logs vì serverless không chia sẻ memory
  const clicks = [
    {
      time: "11/11/2025 23:00",
      city: "Hanoi",
      device: "desktop - Windows 10",
      referrer: "Direct",
    },
    {
      time: "11/11/2025 23:01",
      city: "Ho Chi Minh",
      device: "mobile - iOS 17",
      referrer: "Direct",
    },
  ];

  let html = `
    <h1>Behance Click Tracker (Demo)</h1>
    <p><b>Tổng: ${clicks.length} lượt bấm</b></p>
    <table border="1" cellpadding="5" cellspacing="0">
      <tr><th>Thời gian</th><th>Thành phố</th><th>Thiết bị</th><th>Nguồn</th></tr>
  `;

  clicks
    .slice(-20)
    .reverse()
    .forEach((c) => {
      html += `<tr><td>${c.time}</td><td>${c.city}</td><td>${c.device}</td><td>${c.referrer}</td></tr>`;
    });

  html += `</table><hr><a href="/">Quay lại</a>`;
  res.status(200).send(html);
}
