/**
 * Tauri API type declarations
 */

interface Window {
  __TAURI__?: {
    tauri: {
      invoke: <T = any>(cmd: string, args?: Record<string, any>) => Promise<T>;
    };
  };
}
