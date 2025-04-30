/**
 * UI按钮和控件创建
 */
import { scanAllPages, startAutoScan, stopAutoScan, isAutoScanActive } from '../scanner/autoScan';
import { setPreferredTimeSlots, getPreferredTimeSlots } from '../scanner/timeSlots';
import { initDragFunctionality } from './components/dragHandler';
import { getFreeReservationBlocks, getAgreementCheckbox, getAppointmentButton } from '../utils/domUtils';
import controlPanelHTML from './components/controlPanel.html';
import './styles/controlPanel.css'; // 需要额外配置webpack处理CSS
import lunyuData from './components/lunyu.json';
import { confirmAppointment } from '../scanner/autoScan';
// Interface for Lunyu data structure
interface LunyuChapter {
  chapter: string;
  paragraphs: string[];
}

let autoClickActive = false;

export function addScanButton(): HTMLDivElement {
  // 创建容器并注入HTML
  const container = document.createElement('div');
  container.innerHTML = controlPanelHTML;
  document.body.appendChild(container);
  
  // 获取控制面板元素
  const controlPanel = container.firstElementChild as HTMLDivElement;
  
  // 初始化拖拽功能
  initDragFunctionality(controlPanel);
  
  // 获取UI元素
  const scanBtn = document.getElementById('yligood-scan-btn') as HTMLButtonElement;
  const autoScanBtn = document.getElementById('yligood-auto-scan-btn') as HTMLButtonElement;
  const autoClickBtn = document.getElementById('yligood-auto-click-btn') as HTMLButtonElement;
  const preferredTimesInput = document.getElementById('yligood-preferred-times') as HTMLInputElement;
  const scanIntervalSlider = document.getElementById('yligood-scan-interval') as HTMLInputElement;
  const intervalValueDisplay = document.getElementById('yligood-interval-value') as HTMLSpanElement;
  
  // 设置初始值
  preferredTimesInput.value = getPreferredTimeSlots().join(',');
  intervalValueDisplay.textContent = scanIntervalSlider.value;
  
  // 滑块事件监听，更新显示的值
  scanIntervalSlider.addEventListener('input', () => {
    intervalValueDisplay.textContent = scanIntervalSlider.value;
  });
  
  // 添加事件监听
  scanBtn.addEventListener('click', scanAllPages);
  
  autoScanBtn.addEventListener('click', () => {
    if (!isAutoScanActive()) {
      // 传递扫描间隔（将文本值转为数字）
      if (startAutoScan(parseInt(scanIntervalSlider.value, 10))) {
        autoScanBtn.textContent = '停止定时扫描';
        autoScanBtn.classList.replace('info', 'danger');
      }
    } else {
      if (stopAutoScan()) {
        autoScanBtn.textContent = '开始定时扫描';
        autoScanBtn.classList.replace('danger', 'info');
      }
    }
  });
  
  // 添加自动点击监听按钮事件
  autoClickBtn.addEventListener('click', () => {
    toggleAutoClickListener(autoClickBtn);
  });
  toggleAutoClickListener(autoClickBtn); // 初始化时设置为自动点击状态
  

  preferredTimesInput.addEventListener('change', () => {
    const slots = preferredTimesInput.value.split(',').map(t => t.trim()).filter(t => t);
    setPreferredTimeSlots(slots);
  });

  // 初始化论语显示
  initLunyuQuote();

  return controlPanel;
}

/**
 * 切换自动点击监听状态
 */
function toggleAutoClickListener(button: HTMLButtonElement): void {
  autoClickActive = !autoClickActive;
  if (autoClickActive) {
    // 激活自动点击功能
    button.textContent = '关闭自动点击';
    button.classList.replace('info', 'danger');
    
    // 添加事件委托到document，监听所有空闲预约区块的点击
    document.addEventListener('click', handleReservationBlockClick);
    console.log('已启用自动点击预约模式');
  } else {
    // 停用自动点击功能
    button.textContent = '开启自动点击';
    button.classList.replace('danger', 'info');
    
    // 移除事件监听
    document.removeEventListener('click', handleReservationBlockClick);
    console.log('已停用自动点击预约模式');
  }
}

/**
 * 处理预约区块的点击事件
 */
function handleReservationBlockClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  // 检查点击的元素是否是空闲预约区块或其子元素
  const reservationBlock = target.closest('.reserveBlock.position.free');
  
  if (reservationBlock) {
    console.log('检测到空闲预约区块被点击，自动处理预约流程');
    
    confirmAppointment();
  }
}

/**
 * 初始化论语显示功能
 */
function initLunyuQuote(): void {
  // 首次显示论语
  displayRandomLunyuQuote();
  
  // 每60秒更新一次论语
  setInterval(displayRandomLunyuQuote, 60000);
}

/**
 * 显示随机论语
 */
function displayRandomLunyuQuote(): void {
  const quoteElement = document.getElementById('yligood-lunyu-quote');
  const sourceElement = document.getElementById('yligood-lunyu-source');
  
  if (!quoteElement || !sourceElement) return;
  
  const lunyuChapters = lunyuData as LunyuChapter[];
  

  
  var quote = '' as string;
  var chapter: LunyuChapter | null = null;
  while(quote == '' || quote.length > 50) {
    // 随机选择章节
    const randomChapterIndex = Math.floor(Math.random() * lunyuChapters.length);
    chapter = lunyuChapters[randomChapterIndex];
    // 随机选择段落
    const randomParagraphIndex = Math.floor(Math.random() * chapter.paragraphs.length);
    quote = chapter.paragraphs[randomParagraphIndex];
  }
  // 更新显示
  quoteElement.textContent = quote;
  if(chapter) {
    sourceElement.textContent = `—— 《论语·${chapter.chapter}》`;
  }
}
