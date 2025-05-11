/**
 * XHR interception to detect and handle CAPTCHA challenges
 */
import type { CaptchaResponse } from './types';
import { CaptchaSolver } from './solver';
import { simulateHumanLikeSliderMovement } from './simulator';
import { updateSolverStatus } from './indicator';

export function monitorCaptcha(): void {
  // Store the original XHR open method
  const originalOpen = XMLHttpRequest.prototype.open;
  
  // Override the XHR open method to intercept CAPTCHA API calls
  XMLHttpRequest.prototype.open = function(this: XMLHttpRequest, method: string, url: string) {
    if (typeof url === 'string' && url.includes('/api/captcha/get')) {
      console.log('CAPTCHA API call detected:', url);
      updateSolverStatus('🔍 CAPTCHA Detected');
      
      this.addEventListener('load', function() {
        try {
          console.log('CAPTCHA response:', this.responseText);
          const response = JSON.parse(this.responseText) as CaptchaResponse;
          
          if (response.data && response.data.repCode === '0000' && response.data.repData) {
            const backImgBase = response.data.repData.originalImageBase64;
            const blockBackImgBase = response.data.repData.jigsawImageBase64;
            
            console.log('CAPTCHA detected, attempting to solve...');
            updateSolverStatus('🧩 Analyzing CAPTCHA...');
            
            // Wait for the slider element to appear in the DOM
            setTimeout(() => {
              solveCaptcha(backImgBase, blockBackImgBase);
            }, 500);
          }
        } catch (e) {
          console.error('Error processing CAPTCHA response:', e);
          updateSolverStatus('❌ Error Processing CAPTCHA');
        }
      });
    }
    
    return originalOpen.apply(this, arguments as any);
  };
}

// Solve the CAPTCHA using the images
function solveCaptcha(backImgBase: string, blockImgBase: string): void {
  console.log('Solving CAPTCHA...');
  updateSolverStatus('🔄 Calculating Position...');
  
  // Use our solver to find the correct position
  CaptchaSolver.solveFromBase64(
    backImgBase, 
    blockImgBase, 
    (position) => {
      console.log('Calculated position:', position);
      updateSolverStatus('🎯 Position Found: ' + position + 'px');
      
      // Simulate mouse events with delays instead of directly calling end()
      simulateHumanLikeSliderMovement(position);
    }
  );
}
