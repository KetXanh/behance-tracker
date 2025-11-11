import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
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
                  <th>IP</th>
                  <th>Thành phố</th>
               
                  <th>Thiết bị</th>
                  <th>Trình duyệt</th>
                  <th>Nguồn</th>
                </tr>`;

    clicks.forEach((c) => {
      html += `<tr>
        <td>${new Date(c.time).toLocaleString("vi-VN")}</td>
        <td>${c.ip}</td>
        <td>${c.city}</td>
      
        <td>${c.device}</td>
        <td>${c.browser}</td>
        <td>${c.referrer}</td>
      </tr>`;
    });

    html += `</table>`;
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (err) {
    console.error("stats handler error:", err);
    res.status(500).send("Internal Server Error");
  }
}
