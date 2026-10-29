const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// credentials: "include" sends the httpOnly cookie; the custom header is the CSRF check.
export async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || (data.errors && data.errors.join(", ")) || "Request failed");
  return data;
}
