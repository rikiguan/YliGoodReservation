/**
 * UI components for the CAPTCHA solver
 */

let statusIndicator: HTMLDivElement | null = null;

export function addStatusIndicator(): void {
  // Don't add multiple indicators
  if (statusIndicator) return;
  
  statusIndicator = document.createElement('div');
  statusIndicator.textContent = '🔄 CAPTCHA Auto Solver Active';
  
  // Style the indicator
  Object.assign(statusIndicator.style, {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    background: 'rgba(0, 128, 0, 0.7)',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
    fontSize: '12px',
    zIndex: '9999'
  });
  
  document.body.appendChild(statusIndicator);
}

export function updateSolverStatus(text: string): void {
  if (!statusIndicator) {
    addStatusIndicator();
  }
  
  if (statusIndicator) {
    statusIndicator.textContent = text;
  }
}
