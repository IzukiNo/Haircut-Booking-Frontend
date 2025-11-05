export default async function handler(req, res) {
  const backendURL = "http://157.66.100.145:4000";

  const url = backendURL + req.url;

  let body;
  if (!["GET", "HEAD"].includes(req.method)) {
    body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  }

  const options = {
    method: req.method,
    headers: {
      ...req.headers,
      host: undefined,
      "content-length": undefined,
    },
    body,
  };

  try {
    const response = await fetch(url, options);
    const contentType =
      response.headers.get("content-type") || "application/json";
    const data = await response.text();

    res.setHeader("Content-Type", contentType);
    res.status(response.status).send(data);
  } catch (err) {
    console.error("Proxy Error:", err.message);
    res.status(500).json({
      error: "Proxy Failed",
      detail: err.message,
      forwardTo: url,
    });
  }
}
