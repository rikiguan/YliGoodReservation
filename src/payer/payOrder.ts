import {getPayButton} from '../utils/domUtils';

export function initPayOrder(): void {
  console.log('PayOrder loaded');
  startScanningForPayButton();
}

function startScanningForPayButton(): void {

  let scanAttempts = 0;
  const scanInterval = 500; // 每500ms扫描一次
  
  const intervalId = setInterval(() => {
    scanAttempts++;
    // console.log(`正在扫描支付按钮... 第${scanAttempts}次`);
    
    const payButton = getPayButton();
    if (payButton) {
      payButton.click();
      console.log('支付按钮已找到并点击');
      clearInterval(intervalId); // 找到按钮后停止扫描
    }
  }, scanInterval);
}
