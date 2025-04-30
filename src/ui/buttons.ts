/**
 * UI按钮和控件创建
 */
import { scanAllPages, startAutoScan, stopAutoScan, isAutoScanActive } from '../scanner/autoScan';
import { setPreferredTimeSlots, getPreferredTimeSlots } from '../scanner/timeSlots';
import { initDragFunctionality } from './components/dragHandler';
import controlPanelHTML from './components/controlPanel.html';
import './styles/controlPanel.css'; // 需要额外配置webpack处理CSS

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

  return controlPanel;
}
