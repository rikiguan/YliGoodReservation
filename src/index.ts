/**
 * 主入口文件
 */
import { addScanButton } from './ui/buttons';
import { initCaptchaSolver } from './captcha';

// 初始化
function init(): void {
  addScanButton();
  
  // 初始化CAPTCHA解决器
  initCaptchaSolver();
  
  // 自动扫描 (可选)
  // setTimeout(scanAllPages, 1500);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
