/**
 * 解析表格数据，提取空闲时间段信息
 */
import { getTable } from '../utils/domUtils';
import { isPreferredTimeSlot } from './timeSlots';

// 存储所有页面的空闲信息
let allAvailableSlots: Set<string> = new Set();
let visitedTables: Set<string> = new Set(); // 用于记录已访问过的表格内容，防止死循环
let foundPreferredSlot: boolean = false;

type PreferredSlotCallback = (list : Element[]) => void;

// 解析表格，收集空闲时间段
export function collectAvailableSlots(onPreferredSlotFound?: PreferredSlotCallback): string[] {
  const table = getTable();
  if (!table) return [];
  
  // 生成表格指纹，用于判断是否已访问过
  const tableFingerprint = (table as HTMLElement).innerText.replace(/\s/g, '');
  if (visitedTables.has(tableFingerprint)) return [];
  visitedTables.add(tableFingerprint);
  
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
    
    for (let j = 1; j < tds.length && j-1 < timeHeaders.length; j++) {
      const cell = tds[j] as HTMLElement;
      const text = cell.innerText.trim();
      if (text === '空闲') {
        const timeSlot = timeHeaders[j-1];
        result.push(`${place} ${timeSlot} 可用`);
        
        // 检查是否是首选时间段
        if (isPreferredTimeSlot(timeSlot)) {
          console.log(`找到首选时间段的空闲场地: ${place} ${timeSlot}`);
          foundPreferredSlot = true;
          
          console.log(cell);
          // 获取 cell 中的预约 div 并点击
          const reserveDiv = cell.querySelector('.reserveBlock.position.free');
          if (reserveDiv) {
            preferResult.push(reserveDiv);
          }

        }
      }
    }
  }
  if (foundPreferredSlot && typeof onPreferredSlotFound === 'function') {
    onPreferredSlotFound(preferResult);
  }
  
  return result;
}

// 打印结果
export function printResults(): void {
  if (allAvailableSlots.size === 0) {
    console.log('未找到空闲场地');
  } else {
    console.log('=== 空闲场地时间段汇总 ===');
    Array.from(allAvailableSlots).sort().forEach(slot => console.log(slot));
    console.log(`共找到 ${allAvailableSlots.size} 个空闲时段`);
  }
}

// 添加空闲时段到集合
export function addAvailableSlots(slots: string[]): void {
  slots.forEach(slot => allAvailableSlots.add(slot));
}

// 重置扫描状态
export function resetScanState(): void {
  visitedTables.clear();
  allAvailableSlots.clear();
  foundPreferredSlot = false;
}

// 检查是否已找到首选时间段
export function hasFoundPreferredSlot(): boolean {
  return foundPreferredSlot;
}
