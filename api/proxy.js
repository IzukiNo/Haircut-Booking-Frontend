export default async function handler(req, res) {
  const backendURL = "http://157.66.100.145:4000";

  const url = backendURL + req.url;

  const options = {
    method: req.method,
    headers: {
      ...req.headers,
      host: undefined,
    },
    body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
  };

  try {
    const response = await fetch(url, options);
    const data = await response.text();

    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy error", detail: error.toString() });
  }
}
