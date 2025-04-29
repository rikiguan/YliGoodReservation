/**
 * 管理首选时间段
 */

// 定义时间段接口
interface TimeRange {
  start: number; // 以分钟表示的时间（从午夜开始）
  end: number;   // 以分钟表示的时间（从午夜开始）
}

// 默认首选时间段
let preferredTimeSlots: string[] = [];

// 解析时间字符串为分钟数（例如："18:00" => 1080）
function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// 解析时间段字符串为TimeRange对象
function parseTimeSlot(timeSlot: string): TimeRange | null {
  // 匹配格式如 "18:00-23:00"
  const match = timeSlot.match(/(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/);
  if (!match) return null;
  
  return {
    start: parseTimeToMinutes(match[1]),
    end: parseTimeToMinutes(match[2])
  };
}

// 检查两个时间段是否重叠
function doTimeRangesOverlap(range1: TimeRange, range2: TimeRange): boolean {
  return range1.start < range2.end && range2.start < range1.end;
}

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
  const targetRange = parseTimeSlot(timeSlot);
  if (!targetRange) return false;
  
  return preferredTimeSlots.some(preferred => {
    const preferredRange = parseTimeSlot(preferred);
    return preferredRange && doTimeRangesOverlap(targetRange, preferredRange);
  });
}
