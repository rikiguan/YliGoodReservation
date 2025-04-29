/**
 * 自动扫描页面功能
 */
import { getArrowBtns, getActionButtons ,getAgreementCheckbox,getAppointmentButton,getSubmitAppointmentButton } from '../utils/domUtils';
import { collectAvailableSlots, printResults, addAvailableSlots, resetScanState, hasFoundPreferredSlot } from './tableParser';

let autoScanInterval: number | null = null;

// 自动遍历所有页面
export function scanAllPages(): void {
  console.log('开始扫描空闲场地...');
  resetScanState();
  
  function processCurrentPage(): void {
    // 如果已经找到了首选时间段，停止扫描
    if (hasFoundPreferredSlot()) {
      console.log('已找到首选时间段的空闲场地，停止扫描');
      return;
    }
    
    // 收集当前页数据
    const currentSlots = collectAvailableSlots(nextStepAppointment);
    addAvailableSlots(currentSlots);
    
    // 如果找到了首选时间段，停止扫描
    if (hasFoundPreferredSlot()) return;
    
    // 查找右箭头
    const arrows = getArrowBtns();
    if (arrows.right && arrows.right.offsetParent !== null) {
      // 点击右箭头，延迟后继续处理
      arrows.right.click();
      setTimeout(processCurrentPage, 800);
    } else {
      // 如果没找到首选时间段，打印结果
      if (!hasFoundPreferredSlot()) {
        printResults();
      }
    }
  }
  
  // 开始扫描
  setTimeout(processCurrentPage, 500);
}

// 自动点击按钮并扫描场地
export function startAutoScan(interval: number = 5000): boolean {
  if (autoScanInterval) return false;
  
  console.log('开始自动扫描...');
  let actionSequence: string[] = ['forward', 'refresh'];
  let currentAction: number = 0;
  
  autoScanInterval = window.setInterval(() => {
    const buttons = getActionButtons();
    const action = actionSequence[currentAction];
    
    if (buttons[action as keyof typeof buttons] && buttons[action as keyof typeof buttons]?.offsetParent !== null) {
      console.log(`自动点击: ${action}`);
      buttons[action as keyof typeof buttons]?.click();
    }
    
    currentAction = (currentAction + 1) % actionSequence.length;
    
    // 只有完成一个完整循环后才扫描所有页面
    if (currentAction === 0) {
      setTimeout(scanAllPages, 800);
    }
  }, interval);
  
  return true;
}


//下一步预约操作
export function nextStepAppointment(): void {
  stopAutoScan(); // 停止自动扫描
  
  const agreementCheckbox = getAgreementCheckbox();
  if (agreementCheckbox) {
    agreementCheckbox.click(); // 点击协议复选框
  }
  const appointmentButton = getAppointmentButton();
  if (appointmentButton) {
    appointmentButton.click(); // 点击预约按钮
  } else {
    console.log('未找到预约按钮，可能是页面结构变化或按钮不可见');
  }
  //等待网页加载完毕延迟
  setTimeout(() => {
    const submitButton = getSubmitAppointmentButton();
    if (submitButton) {
      submitButton.click(); // 点击提交预约按钮
    } else {
      console.log('未找到提交预约按钮，可能是页面结构变化或按钮不可见');
    }
  }, 1000); // 延迟1秒等待页面加载

}


export function stopAutoScan(): boolean {
  if (autoScanInterval) {
    clearInterval(autoScanInterval);
    autoScanInterval = null;
    console.log('自动扫描已停止');
    return true;
  }
  return false;
}

export function isAutoScanActive(): boolean {
  return autoScanInterval !== null;
}
