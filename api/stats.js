import { createClient } from "@supabase/supabase-js";

// Tạo client Supabase
const supabase = createClient(
  "https://mvctquugijeqhosuctwz.supabase.co", // SUPABASE_URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12Y3RxdXVnaWplcWhvc3VjdHd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NzgyMjQsImV4cCI6MjA3ODQ1NDIyNH0.ZSrmsmKx5j5DsNpe8KDF7TnLr2OlaoYYnJKq0lnOGMo" // SUPABASE_KEY
);

export default async function handler(req, res) {
  try {
    const { data: clicks, error } = await supabase
      .from("clicks")
      .select("*")
      .order("time", { ascending: false })
      .limit(20);

    if (error) throw error;

    let html = `<h1>Behance Click Tracker</h1>
                <p><b>Tổng: ${clicks.length}</b></p>
                <table border="1" cellpadding="5" cellspacing="0">
                <tr>
                  <th>Thời gian</th>
                  <th>Thành phố</th>
                  <th>Quốc gia</th>
                  <th>Thiết bị</th>
                  <th>Trình duyệt</th>
                  <th>Nguồn</th>
                </tr>`;

    clicks.forEach((c) => {
      html += `<tr>
        <td>${new Date(c.time).toLocaleString("vi-VN")}</td>
        <td>${c.city || ""}</td>
        <td>${c.country || ""}</td>
        <td>${c.device || ""}</td>
        <td>${c.browser || ""}</td>
        <td>${c.referrer || ""}</td>
      </tr>`;
    });

    html += `</table><hr><a href="/">Quay lại</a>`;
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (err) {
    console.error("stats handler error:", err);
    res.status(500).send("Internal Server Error");
  }
}
