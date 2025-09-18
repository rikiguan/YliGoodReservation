import { unsafeWindow } from "$";

// <!-- Google tag (gtag.js) -->
export function insertGoogleTag(): void {
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-TGBCP1Y2B7';
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-TGBCP1Y2B7');
  `;
  document.head.appendChild(script2);
}

export function trackEvent(eventName: string, eventParams: Record<string, any>): void {
  if ((unsafeWindow as any).gtag) {
    (unsafeWindow as any).gtag('event', eventName, eventParams);
  } else {
    console.warn('gtag is not defined');
  }
}

export function track_gym_success(gymName: string): void {
  trackEvent('gym_success', { type: gymName });
}

export function track_auto_click(action: string): void {
  trackEvent('auto_click', { action });
}

export function track_auto_scan(intervalSeconds: number): void {
  trackEvent('auto_scan', { interval_seconds: intervalSeconds });
}