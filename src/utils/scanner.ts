import { useReservationStore } from '@/stores/reservation';
import { useUIStore } from '@/stores/ui';
import { getTable, getArrowBtns, getAgreementCheckbox, getAppointmentButton, getCompanionCheckboxList, getSubmitAppointmentButton, getOrderNumber, getOrderPlace, getOrderUser, getOrderPartner, getActionButtons } from '@/utils/dom';

let autoScanIntervalId: number | null = null;

// 开始自动扫描
export function startAutoScan(intervalSeconds?: number): boolean {
  const reservationStore = useReservationStore();

  if (autoScanIntervalId !== null) {
    console.log('已经有一个自动扫描正在运行，请先停止它');
    return false;
  }
  reservationStore.foundPreferredSlot = false;
  // 如果提供了间隔参数，更新存储中的间隔值
  if (intervalSeconds !== undefined) {
    reservationStore.setScanInterval(intervalSeconds);
  }

  console.log(`启动自动扫描，间隔 ${reservationStore.scanIntervalSeconds} 秒`);

  // 立即执行一次扫描
  autoScanAction(reservationStore);

  // 设置定时器进行后续扫描
  autoScanIntervalId = window.setInterval(() => {
    autoScanAction(reservationStore);
    console.log(`自动扫描间隔 ${reservationStore.scanIntervalSeconds} 秒`);
  }, reservationStore.scanIntervalSeconds * 1000);

  return true;
}

function autoScanAction(reservationStore: ReturnType<typeof useReservationStore>): void {

  const actionSequence: string[] = ['forward', 'refresh'];

  for (let i = 0; i < actionSequence.length; i++) {
    const action = actionSequence[i];
    const buttons = getActionButtons();
    if (buttons[action as keyof typeof buttons] && buttons[action as keyof typeof buttons]?.offsetParent !== null) {
      console.log(`自动点击: ${action}`);
      buttons[action as keyof typeof buttons]?.click();
    }
  }
  // // 如果已找到首选时间段，停止扫描
  // if (reservationStore.foundPreferredSlot) {
  //   stopAutoScan();
  //   return;
  // }
  console.log(reservationStore.foundPreferredSlot);
  setTimeout(scanAllPages, 500);
}

// 停止自动扫描
export function stopAutoScan(): boolean {
  if (autoScanIntervalId === null) {
    return false;
  }

  clearInterval(autoScanIntervalId);
  autoScanIntervalId = null;
  const reservationStore = useReservationStore();
  reservationStore.autoScanActive = false;
  console.log('已停止自动扫描');
  return true;
}

// 判断自动扫描是否激活
export function isAutoScanActive(): boolean {
  return autoScanIntervalId !== null;
}

// 自动遍历所有页面
export function scanAllPages(): void {
  console.log('开始扫描空闲场地...');
  const reservationStore = useReservationStore();
  reservationStore.resetScanState();

  function processCurrentPage(): void {
    // 如果已经找到了首选时间段，停止扫描
    if (reservationStore.foundPreferredSlot) {
      console.log('已找到首选时间段的空闲场地，停止扫描');
      return;
    }

    // 收集当前页数据
    const currentSlots = collectAvailableSlots();
    reservationStore.addAvailableSlots(currentSlots);


    // 查找右箭头
    const arrows = getArrowBtns();
    if (arrows.right && arrows.right.offsetParent !== null) {
      // 点击右箭头，延迟后继续处理
      arrows.right.click();
      setTimeout(processCurrentPage, 10);
    } else {
      // 如果没找到首选时间段，打印结果
      if (!reservationStore.foundPreferredSlot) {
        printResults();
      }
    }
  }

  // 开始扫描
  processCurrentPage();
}

// 下一步预约操作
export function nextStepAppointment(list: Element[]): void {
  if (list.length === 0) {
    console.log('没有可用的预约块');
    return;
  }

  //从list随机选择一个元素
  const randomIndex = Math.floor(Math.random() * list.length);
  const randomElement = list[randomIndex];
  console.log('随机选择的预约块:', randomElement);

  const reservationStore = useReservationStore();

  (randomElement as HTMLElement).click(); // 点击随机选择的预约块
  stopAutoScan(); // 停止自动扫描 二次确认
  setTimeout(confirmAppointment, 200);
}

/**
 * 处理预约区块的点击事件
 */
export function handleReservationBlockClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  // 检查点击的元素是否是空闲预约区块或其子元素
  const reservationBlock = target.closest('.reserveBlock.position.free');

  if (reservationBlock) {
    console.log('检测到空闲预约区块被点击，自动处理预约流程');

    setTimeout(confirmAppointment, 200);
  }
}

// 确认预约
export function confirmAppointment(): void {
  // 点击协议复选框
  const agreementCheckbox = getAgreementCheckbox();
  if (agreementCheckbox) {
    agreementCheckbox.click();
  }

  // 点击预约按钮
  const appointmentButton = getAppointmentButton();
  if (appointmentButton) {
    appointmentButton.click();
  } else {
    console.log('未找到预约按钮，可能是页面结构变化或按钮不可见');
  }

  // 等待网页加载完毕延迟
  setTimeout(() => {
    // 选择同伴
    const companionCheckboxes = getCompanionCheckboxList();
    if (companionCheckboxes && companionCheckboxes.length > 0) {
      const randomIndex = Math.floor(Math.random() * companionCheckboxes.length);
      const randomCheckbox = companionCheckboxes[randomIndex];
      randomCheckbox.click(); // 点击随机选择的复选框
    } else {
      console.log('未找到可用的同伴复选框');
    }

    // 点击提交订单按钮
    const submitButton = getSubmitAppointmentButton();
    if (submitButton) {
      submitButton.click(); // 点击提交预约按钮

    } else {
      console.log('未找到提交预约按钮，可能是页面结构变化或按钮不可见');
    }
  }, 100);
}

// 检查订单信息并显示成功通知
export function checkOrderAndShowNotification(): void {
  const orderNumber = getOrderNumber() || '未获取到订单号';
  const orderPlace = getOrderPlace() || '未获取到场地信息';
  const orderUser = getOrderUser() || '未获取到使用者信息';
  const orderPartner = getOrderPartner() || '无同伴';

  const uiStore = useUIStore();
  uiStore.showSuccessNotification({
    orderNumber,
    orderPlace,
    orderUser,
    orderPartner
  });
}

// 解析表格，收集空闲时间段
function collectAvailableSlots(): string[] {
  const reservationStore = useReservationStore();
  const table = getTable();
  if (!table) return [];

  // 生成表格指纹，用于判断是否已访问过
  const tableFingerprint = (table as HTMLElement).innerText.replace(/\s/g, '');
  if (reservationStore.visitedTables.has(tableFingerprint)) return [];
  reservationStore.visitedTables.add(tableFingerprint);

  const rows = table.querySelectorAll('tbody tr');
  if (rows.length < 2) return [];

  // 获取时间段表头
  const timeHeaders: string[] = [];
  const ths = table.querySelectorAll('thead tr:first-child td');
  for (let i = 1; i < ths.length; i++) {
    const headerText = (ths[i] as HTMLElement).innerText.trim();
    if (headerText && !headerText.includes('场地')) {
      timeHeaders.push(headerText);
    }
  }

  // 遍历每一行，查找空闲
  let result: string[] = [];
  let preferResult: Element[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.classList.contains('mobileStyle')) continue; // 跳过表头行

    const tds = row.querySelectorAll('td');
    if (tds.length <= 1) continue;

    const place = (tds[0] as HTMLElement).innerText.trim();
    if (!place || place === '场地') continue;

    for (let j = 1; j < tds.length && j - 1 < timeHeaders.length; j++) {
      const cell = tds[j] as HTMLElement;
      const text = cell.innerText.trim();
      if (text === '空闲') {
        const timeSlot = timeHeaders[j - 1];
        result.push(`${place} ${timeSlot} 可用`);

        // 检查是否是首选时间段
        if (reservationStore.isPreferredTimeSlot(timeSlot)) {
          console.log(`找到首选时间段的空闲场地: ${place} ${timeSlot}`);
          reservationStore.setFoundPreferredSlot(true);

          // 获取 cell 中的预约 div 并点击
          const reserveDiv = cell.querySelector('.reserveBlock.position.free');
          if (reserveDiv) {
            preferResult.push(reserveDiv);
          }
        }
      }
    }
  }
  if (reservationStore.foundPreferredSlot && preferResult.length > 0) {
    nextStepAppointment(preferResult);
  }

  return result;
}

// 打印结果
function printResults(): void {
  const reservationStore = useReservationStore();
  if (reservationStore.availableSlotsArray.length === 0) {
    console.log('未找到空闲场地');
  } else {
    console.log('=== 空闲场地时间段汇总 ===');
    reservationStore.availableSlotsArray.forEach(slot => console.log(slot));
    console.log(`共找到 ${reservationStore.availableSlotsCount} 个空闲时段`);
  }
}
