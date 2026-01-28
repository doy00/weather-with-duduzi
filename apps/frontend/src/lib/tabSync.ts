export type SyncMessage =
  | { type: 'FAVORITES_INVALIDATE' }
  | { type: 'WEATHER_UPDATE'; data: { lat: number; lon: number; weather: unknown } }
  | { type: 'FAVORITE_ADDED'; data: { id: string } }
  | { type: 'FAVORITE_REMOVED'; data: { id: string } }
  | { type: 'NICKNAME_UPDATED'; data: { id: string; nickname: string } }
  | { type: 'FAVORITES_REORDERED'; data: Record<string, never> };

export type SyncListener = (message: SyncMessage) => void;

class TabSyncManager {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<SyncListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('weather-app-sync');
      this.channel.onmessage = (event) => {
        this.listeners.forEach((listener) => listener(event.data));
      };

      window.addEventListener('beforeunload', () => {
        this.close();
      });
    }
  }

  send(message: SyncMessage) {
    this.channel?.postMessage(message);
  }

  subscribe(listener: SyncListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  close() {
    this.channel?.close();
    this.listeners.clear();
  }
}

export const tabSync = new TabSyncManager();
