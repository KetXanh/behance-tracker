export default function handler(req, res) {
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`
    <h1>Behance Tracker Demo</h1>
    <ul>
      <li><a href="/behance">Go to Behance</a></li>
      <li><a href="/stats">View Stats</a></li>
    </ul>
  `);
}
