/**
 * 主入口文件
 */
import { addScanButton } from './ui/buttons';
import { initCaptchaSolver } from './captcha';
import { initPayOrder } from './payer/payOrder'; 
// 初始化
function init(): void {
  addScanButton();
  
  // 初始化CAPTCHA解决器
  initCaptchaSolver();
  
  initPayOrder(); // 立即支付订单
  // 自动扫描 (可选)
  // setTimeout(scanAllPages, 1500);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
