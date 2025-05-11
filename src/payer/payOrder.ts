import {getPayButton, getOrderNumber, getOrderPlace, getOrderUser, getOrderPartner} from '../utils/dom';
import { checkOrderAndShowNotification } from "../utils/scanner";
// 用于追踪已处理的订单ID
const processedOrderIds = new Set<string>();

export function initPayOrder(): void {
  console.log('PayOrder loaded');
  startWatchingForPayButton();
}

function startWatchingForPayButton(): void {
  // 创建观察器实例
  const observer = new MutationObserver((mutations) => {
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
    }
  });
  
  // 配置观察选项
  const config = { 
    childList: true,     // 观察目标子节点的变化
    subtree: true,       // 观察所有后代节点
    attributes: true     // 观察属性变化
  };
  
  // 开始观察整个文档
  observer.observe(document.body, config);
  
  // 添加一个全局变量来允许在需要时手动停止观察
  (window as any).__stopPaymentWatching = () => {//HACK
    observer.disconnect();
    console.log('支付观察已手动停止');
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
  console.log('显示预约成功提示');
  checkOrderAndShowNotification();
}
