/**
 * 自动扫描页面功能
 */
import { getCompanionCheckboxList,getArrowBtns, getActionButtons ,getAgreementCheckbox,getAppointmentButton,getSubmitAppointmentButton } from '../utils/domUtils';
import { collectAvailableSlots, printResults, addAvailableSlots, resetScanState, hasFoundPreferredSlot } from './tableParser';

let autoScanIntervalId: number | null = null;
let scanIntervalSeconds = 5; // 默认5秒
//TODO 把延时文件单独成一个文件
// 修改startAutoScan函数接收间隔参数
export function startAutoScan(intervalSeconds?: number): boolean {
  if (autoScanIntervalId !== null) {
    return false; // 已经在运行中
  }
  
  // 如果提供了间隔参数，则更新扫描间隔
  if (intervalSeconds !== undefined) {
    scanIntervalSeconds = intervalSeconds;
  }


  let actionSequence: string[] = ['forward', 'refresh'];


  // 启动自动扫描
  autoScanIntervalId = window.setInterval(() => {
    for(let i = 0; i < actionSequence.length; i++) {
      const action = actionSequence[i];
      const buttons = getActionButtons();
      if (buttons[action as keyof typeof buttons] && buttons[action as keyof typeof buttons]?.offsetParent !== null) {
        console.log(`自动点击: ${action}`);
        buttons[action as keyof typeof buttons]?.click();
      }
    }

    setTimeout(scanAllPages, 800);
  }, scanIntervalSeconds * 1000);
  
  return true;
}

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
      setTimeout(processCurrentPage, 10);
    } else {
      // 如果没找到首选时间段，打印结果
      if (!hasFoundPreferredSlot()) {
        printResults();
      }
    }
  }
  
  // 开始扫描
  // setTimeout(processCurrentPage, 500);
  processCurrentPage();
}


//下一步预约操作
export function nextStepAppointment(list:Element[]): void {
  if (list.length === 0) {
    console.log('没有可用的预约块');
    return;
  }
  //从list随机选择一个元素
  const randomIndex = Math.floor(Math.random() * list.length);
  const randomElement = list[randomIndex];
  console.log('随机选择的预约块:', randomElement);
  (randomElement  as HTMLElement).click(); // 点击随机选择的预约块


  stopAutoScan(); // 停止自动扫描
  //延迟10ms
  setTimeout(confirmAppointment, 10); 

}

export function confirmAppointment(): void {
  
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
    
    const companionCheckboxes = getCompanionCheckboxList();
    if (companionCheckboxes && companionCheckboxes.length > 0) {
      const randomIndex = Math.floor(Math.random() * companionCheckboxes.length);
      const randomCheckbox = companionCheckboxes[randomIndex];
      randomCheckbox.click(); // 点击随机选择的复选框
    } else {
      console.log('未找到可用的同伴复选框');
    }

    const submitButton = getSubmitAppointmentButton();
    if (submitButton) {
      submitButton.click(); // 点击提交预约按钮
    } else {
      console.log('未找到提交预约按钮，可能是页面结构变化或按钮不可见');
    }
  }, 100); // 延迟1秒等待页面加载
}

export function stopAutoScan(): boolean {
  if (autoScanIntervalId) {
    clearInterval(autoScanIntervalId);
    autoScanIntervalId = null;
    console.log('自动扫描已停止');
    return true;
  }
  return false;
}

export function isAutoScanActive(): boolean {
  return autoScanIntervalId !== null;
}
