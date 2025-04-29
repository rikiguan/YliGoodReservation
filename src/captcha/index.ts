/**
 * Main entry point for CAPTCHA solver functionality
 */
import { monitorCaptcha } from './interceptor';
import { addStatusIndicator } from './uiindicator';

export function initCaptchaSolver(): void {
  console.log('CAPTCHA Auto Solver loaded');
  
  // Start monitoring for CAPTCHAs after a short delay
  setTimeout(() => {
    monitorCaptcha();
    addStatusIndicator();
  }, 1000);
}

// Export all the useful components
export * from './solver';
export * from './simulator';
export * from './uiindicator';
export * from './interceptor';
