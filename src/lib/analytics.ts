import type { AnalyticsEvent, AnalyticsMetadata } from "@/constants/analytics";

export function trackEvent(event: AnalyticsEvent, metadata?: AnalyticsMetadata) {
  if (typeof window === "undefined") return;
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, metadata }),
    keepalive: true,
  }).catch(() => {});
}
