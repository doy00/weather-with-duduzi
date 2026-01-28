import { VAPID_PUBLIC_KEY } from '@/config/constants';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeToPush(): Promise<PushSubscription> {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Worker를 지원하지 않는 브라우저입니다');
  }

  if (!('PushManager' in window)) {
    throw new Error('Push API를 지원하지 않는 브라우저입니다');
  }

  if (!VAPID_PUBLIC_KEY) {
    throw new Error('VAPID Public Key가 설정되지 않았습니다');
  }

  const registration = await navigator.serviceWorker.ready;

  // 기존 구독 확인
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    // 새로 구독
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  return subscription;
}

export async function unsubscribeFromPush(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) return false;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    return subscription.unsubscribe();
  }
  return false;
}

export async function getPushSubscription(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator)) return null;

  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}
