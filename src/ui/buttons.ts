/**
 * UI按钮和控件创建
 */
import { scanAllPages, startAutoScan, stopAutoScan, isAutoScanActive } from '../scanner/autoScan';
import { setPreferredTimeSlots, getPreferredTimeSlots } from '../scanner/timeSlots';
import { initDragFunctionality } from './components/dragHandler';
import controlPanelHTML from './components/controlPanel.html';
import './styles/controlPanel.css'; // 需要额外配置webpack处理CSS
import lunyuData from './components/lunyu.json';

// Interface for Lunyu data structure
interface LunyuChapter {
  chapter: string;
  paragraphs: string[];
}

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
  
  preferredTimesInput.addEventListener('change', () => {
    const slots = preferredTimesInput.value.split(',').map(t => t.trim()).filter(t => t);
    setPreferredTimeSlots(slots);
  });

  // 初始化论语显示
  initLunyuQuote();

  return controlPanel;
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
  
  // 随机选择章节
  const randomChapterIndex = Math.floor(Math.random() * lunyuChapters.length);
  const chapter = lunyuChapters[randomChapterIndex];
  
  // 随机选择段落
  const randomParagraphIndex = Math.floor(Math.random() * chapter.paragraphs.length);
  const quote = chapter.paragraphs[randomParagraphIndex];
  
  // 更新显示
  quoteElement.textContent = quote;
  sourceElement.textContent = `—— 《论语·${chapter.chapter}》`;
}
