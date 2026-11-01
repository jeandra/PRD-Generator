export function trackEvent(
  event: string,
  metadata?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return;
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, metadata }),
    keepalive: true,
  }).catch(() => {});
}
