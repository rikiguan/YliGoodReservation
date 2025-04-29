/**
 * 管理首选时间段
 */

// 默认首选时间段
let preferredTimeSlots: string[] = [];

// 设置首选时间段
export function setPreferredTimeSlots(slots: string[]): void {
  preferredTimeSlots = Array.isArray(slots) ? slots : [];
  console.log('首选时间段已设置:', preferredTimeSlots);
}

// 获取首选时间段
export function getPreferredTimeSlots(): string[] {
  return [...preferredTimeSlots];
}

// 检查时间段是否在首选时间段内
export function isPreferredTimeSlot(timeSlot: string): boolean {
  return preferredTimeSlots.some(preferred => timeSlot.includes(preferred));
}
