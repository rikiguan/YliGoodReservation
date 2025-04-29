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
  
  // 设置初始值
  preferredTimesInput.value = getPreferredTimeSlots().join(',');
  
  // 添加事件监听
  scanBtn.addEventListener('click', scanAllPages);
  
  autoScanBtn.addEventListener('click', () => {
    if (!isAutoScanActive()) {
      if (startAutoScan()) {
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
