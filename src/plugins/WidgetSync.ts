import { Capacitor } from '@capacitor/core';

export class WidgetSync {
  static async updateWidgetLocation(lat: number, lon: number) {
    if (!Capacitor.isNativePlatform()) return;

    try {
      localStorage.setItem('widget_location', JSON.stringify({ lat, lon }));
      console.log('위젯 위치 동기화:', lat, lon);
    } catch (error) {
      console.error('위젯 동기화 실패:', error);
    }
  }
}
