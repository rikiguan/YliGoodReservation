/**
 * UI按钮和控件创建
 */
import { scanAllPages, startAutoScan, stopAutoScan, isAutoScanActive } from '../scanner/autoScan';
import { setPreferredTimeSlots, getPreferredTimeSlots } from '../scanner/timeSlots';
import { 
  containerStyle, 
  scanButtonStyle,
  autoScanActiveButtonStyle,
  autoScanInactiveButtonStyle,
  labelStyle,
  inputStyle,
  noteStyle,
  applyStyles
} from './styles';

export function addScanButton(): HTMLDivElement {
  const container = document.createElement('div');
  applyStyles(container, containerStyle);
  
  // 创建扫描按钮
  const scanBtn = document.createElement('button');
  scanBtn.textContent = '扫描空闲场地';
  applyStyles(scanBtn, scanButtonStyle);
  scanBtn.addEventListener('click', scanAllPages);
  
  // 创建自动扫描按钮
  const autoScanBtn = document.createElement('button');
  autoScanBtn.textContent = '开始定时扫描';
  applyStyles(autoScanBtn, autoScanInactiveButtonStyle);
  autoScanBtn.addEventListener('click', () => {
    if (!isAutoScanActive()) {
      if (startAutoScan()) {
        autoScanBtn.textContent = '停止定时扫描';
        applyStyles(autoScanBtn, autoScanActiveButtonStyle);
      }
    } else {
      if (stopAutoScan()) {
        autoScanBtn.textContent = '开始定时扫描';
        applyStyles(autoScanBtn, autoScanInactiveButtonStyle);
      }
    }
  });
  
  // 添加首选时间段设置
  const preferredTimesLabel = document.createElement('div');
  preferredTimesLabel.textContent = '设置首选时间段:';
  applyStyles(preferredTimesLabel, labelStyle);
  
  const preferredTimesInput = document.createElement('input');
  preferredTimesInput.type = 'text';
  preferredTimesInput.placeholder = '例如: 9:00-10:30,18:00-19:30';
  applyStyles(preferredTimesInput, inputStyle);
  preferredTimesInput.value = getPreferredTimeSlots().join(',');
  preferredTimesInput.addEventListener('change', () => {
    const slots = preferredTimesInput.value.split(',').map(t => t.trim()).filter(t => t);
    setPreferredTimeSlots(slots);
  });
  
  const noteLabel = document.createElement('div');
  noteLabel.textContent = '注: 找到首选时间会自动停止并点击';
  applyStyles(noteLabel, noteStyle);
  
  container.appendChild(scanBtn);
  container.appendChild(autoScanBtn);
  container.appendChild(preferredTimesLabel);
  container.appendChild(preferredTimesInput);
  container.appendChild(noteLabel);
  document.body.appendChild(container);

  return container;
}
