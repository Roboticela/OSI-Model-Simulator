/**
 * Detect if the app is running inside a Tauri shell (v1 or v2).
 * Tauri v2 injects __TAURI_INTERNALS__ or __TAURI_METADATA__; v1 uses __TAURI__.
 */
export function isTauri(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as Window & {
    __TAURI__?: unknown;
    __TAURI_INTERNALS__?: unknown;
    __TAURI_METADATA__?: unknown;
  };
  return (
    "__TAURI_INTERNALS__" in w ||
    "__TAURI_METADATA__" in w ||
    w.__TAURI__ !== undefined
  );
}

export interface OpenLinkOptions {
  /** When in browser: open in new tab. When in Tauri, URL always opens in default browser. Default: false (same tab in browser). */
  openInNewTab?: boolean;
}

/**
 * Open a link: in Tauri opens in the system default browser; in browser does normal navigation.
 */
export async function openLink(url: string, options: OpenLinkOptions = {}): Promise<void> {
  const { openInNewTab = false } = options;

  if (isTauri()) {
    const { openUrl } = await import("@tauri-apps/plugin-opener");
    await openUrl(url);
    return;
  }

  // Browser: normal link navigation
  if (openInNewTab) {
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    window.location.href = url;
  }
}
