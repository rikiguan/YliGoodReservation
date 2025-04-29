/**
 * Mouse movement simulation for CAPTCHA solving
 */
import { updateSolverStatus } from './uiIndicator';

// Simulate human-like slider movement with delays
export function simulateHumanLikeSliderMovement(position: number): void {
  try {
    // Find the slider element
    const sliderElement = document.querySelector('.verify-move-block') as HTMLElement;
    
    if (!sliderElement) {
      console.error('Could not find slider element with class .verify-move-block');
      // Try to find any slider-like element as fallback
      const fallbackSelectors = ['.slider', '.drag', '.captcha-slider', '[class*="slider"]', '[class*="drag"]'];
      for (const selector of fallbackSelectors) {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
          console.log('Found fallback slider element:', selector);
          simulateSliderEvents(element, position);
          return;
        }
      }
      console.error('Could not find any slider element');
      return;
    }
    
    console.log('Found slider element:', sliderElement);
    simulateSliderEvents(sliderElement, position);
  } catch (error) {
    console.error('Error while simulating slider movement:', error);
  }
}

// Function to simulate mouse events on slider with delays
export function simulateSliderEvents(sliderElement: HTMLElement, targetPosition: number): void {
  targetPosition += 10;
  // Get slider position and dimensions
  const rect = sliderElement.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;
  const endX = startX + targetPosition;
  
  console.log(`Starting slider movement simulation from (${startX}, ${startY}) to (${endX}, ${startY})`);
  updateSolverStatus('🔄 Moving Slider...');
  
  // Step 1: Trigger mousedown on the slider
  const mouseDownEvent = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: startX,
    clientY: startY
  });
  sliderElement.dispatchEvent(mouseDownEvent);
  console.log('Dispatched mousedown event');
  
  // Step 2: Add delay between mousedown and mousemove (100-300ms is natural)
  const moveDelay = Math.floor(Math.random() * 200) + 100; // Random delay between 100-300ms
  
  setTimeout(() => {
    // Create some intermediate points for more realistic movement
    const steps = Math.floor(targetPosition / 10) + 5; // Create enough steps for smooth movement
    const stepDelay = 10; // 10ms between each small move
    
    // Simulate gradual movement with multiple mousemove events
    let currentStep = 0;
    
    function moveStep() {
      if (currentStep <= steps) {
        // Calculate current position using easeOutQuad for natural movement
        const progress = currentStep / steps;
        const easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
        const currentX = startX + targetPosition * easeProgress;
        
        // Dispatch mousemove event
        const mouseMoveEvent = new MouseEvent('mousemove', {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: currentX,
          clientY: startY
        });
        document.dispatchEvent(mouseMoveEvent);
        
        currentStep++;
        setTimeout(moveStep, stepDelay);
      } else {
        // All movement steps completed, now trigger mouseup after a short delay
        const releaseDelay = Math.floor(Math.random() * 50) + 50; // Random delay between 50-100ms
        
        setTimeout(() => {
          // Step 3: Trigger mouseup at the final position
          const mouseUpEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: endX-10,
            clientY: startY
          });
          document.dispatchEvent(mouseUpEvent);
          console.log('Slider movement completed');
          updateSolverStatus('✅ CAPTCHA Solved');
        }, releaseDelay);
      }
    }
    
    // Start the movement sequence
    moveStep();
    
  }, moveDelay);
}
