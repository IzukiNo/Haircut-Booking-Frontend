export default async function handler(req, res) {
  const backendURL = "http://157.66.100.145:4000";
  const url = backendURL + req.url;

  let body = undefined;
  if (!["GET", "HEAD"].includes(req.method)) {
    body = req.headers["content-type"]?.includes("application/json")
      ? JSON.stringify(req.body)
      : req.body;
  }

  try {
    const r = await fetch(url, {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined,
        "content-length": undefined,
      },
      body,
    });

    const data = await r.text();
    res.setHeader(
      "Content-Type",
      r.headers.get("content-type") || "application/json"
    );
    res.status(r.status).send(data);
  } catch (err) {
    res.status(500).json({ error: "Proxy error", detail: err.message });
  }
}
