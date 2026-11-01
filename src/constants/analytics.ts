export const ANALYTICS_EVENTS = [
  "generate_started",
  "generate_completed",
  "regenerate_completed",
  "refine_completed",
  "exported",
  "share_enabled",
  "demo_loaded",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

export type AnalyticsMetadata = Record<string, string | number | boolean>;
