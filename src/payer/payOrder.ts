import {getPayButton, getOrderNumber, getOrderPlace, getOrderUser, getOrderPartner} from '../utils/domUtils';
import successNotificationHTML from '../ui/components/successNotification.html';
import '../ui/styles/notification.css'; // Import the CSS file for notifications

// 用于追踪已处理的订单ID
const processedOrderIds = new Set<string>();

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
      // 获取当前订单ID
      const currentOrderId = getOrderNumber();
      
      // 只有在订单ID存在且未被处理过的情况下才点击支付按钮
      if (currentOrderId && !processedOrderIds.has(currentOrderId)) {
        console.log(`发现新订单: ${currentOrderId}`);
        processedOrderIds.add(currentOrderId);
        payButton.click();
        console.log(`支付按钮已点击，订单ID: ${currentOrderId}`);
        
        // 延迟显示预约成功提示
        setTimeout(() => {
          showSuccessNotification();
        }, 1500);
      } else if (currentOrderId) {
        console.log(`忽略已处理的订单: ${currentOrderId}`);
      } else {
        console.log('找到支付按钮但无法获取订单ID，跳过处理');
      }
      
      // 注意：我们不再调用clearInterval，继续扫描以处理新订单
    }
  }, scanInterval);
  
  // 添加一个全局变量来允许在需要时手动停止扫描
  (window as any).__stopPaymentScanning = () => {//HACK
    clearInterval(intervalId);
    console.log('支付扫描已手动停止');
  };
  (window as any).__showSuccessNotification = () => {//HACK
    showSuccessNotification();
    console.log('支付扫描已手动停止');
  };
  // 添加新的全局函数
  (window as any).__yourNewGlobalFunction = (param1: any) => {//HACK
    console.log('新的全局函数被调用，参数:', param1);
    // 在这里添加你的函数逻辑
    return '函数执行结果';
  };
}

function showSuccessNotification(): void {
  try {
    console.log('显示预约成功提示');
    // 创建通知元素
    const notificationWrapper = document.createElement('div');
    notificationWrapper.className = 'yligood-notification-wrapper';
    notificationWrapper.innerHTML = successNotificationHTML;
    
    document.body.appendChild(notificationWrapper);
    console.log('通知元素已添加到DOM中');
    
    // 获取订单信息并填充
    const orderNumber = getOrderNumber() || '未知';
    const orderPlace = getOrderPlace() || '未知';
    const orderUser = getOrderUser() || '未知';
    const orderPartner = getOrderPartner() || '无';
    
    const orderNumberEl = notificationWrapper.querySelector('#yligood-order-number');
    const orderPlaceEl = notificationWrapper.querySelector('#yligood-order-place');
    const orderUserEl = notificationWrapper.querySelector('#yligood-order-user');
    const orderPartnerEl = notificationWrapper.querySelector('#yligood-order-partner');
    
    if (orderNumberEl) orderNumberEl.textContent = orderNumber;
    if (orderPlaceEl) orderPlaceEl.textContent = orderPlace;
    if (orderUserEl) orderUserEl.textContent = orderUser;
    if (orderPartnerEl) orderPartnerEl.textContent = orderPartner;
    
    // 添加关闭按钮事件
    const closeButton = notificationWrapper.querySelector('#yligood-close-notification');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        document.body.removeChild(notificationWrapper);
        console.log('通知已被关闭');
      });
    }
    
    // 自动关闭（30秒后）
    setTimeout(() => {
      if (document.body.contains(notificationWrapper)) {
        document.body.removeChild(notificationWrapper);
        console.log('通知已自动关闭');
      }
    }, 30000);
  } catch (error) {
    console.error('显示预约成功提示时发生错误:', error);
  }
}
