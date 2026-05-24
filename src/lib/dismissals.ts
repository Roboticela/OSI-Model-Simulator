export const DISMISSAL_KEYS = {
  osiIntro: "osi-intro-dismissed",
  gamesPromo: "games-promo-dismissed",
  legacyBanner: "osi-legacy-banner-dismissed",
} as const;

export type DismissalKey = (typeof DISMISSAL_KEYS)[keyof typeof DISMISSAL_KEYS];

export function isDismissed(key: DismissalKey): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(key) === "true";
}

export function setDismissed(key: DismissalKey): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, "true");
}
