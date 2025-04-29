/**
 * DOM utilities for element selection
 */

interface ArrowButtons {
  right: HTMLElement | null;
  left: HTMLElement | null;
}

interface ActionButtons {
  forward: HTMLButtonElement | null;
  refresh: HTMLButtonElement | null;
}

// 获取表格元素
export function getTable(): HTMLTableElement | null {
  return document.querySelector('#scrollTable table');
}

// 获取翻页箭头按钮
export function getArrowBtns(): ArrowButtons {
  return {
    right: document.querySelector('.pull-right') as HTMLElement,
    left: document.querySelector('.pull-left') as HTMLElement
  };
}

// 获取可点击的操作按钮
export function getActionButtons(): ActionButtons {
  return {
    // 使用更具体的选择器匹配前进按钮
    forward: document.querySelector('.btnMaring.ivu-btn .ivu-icon-ios-arrow-forward')?.closest('button') as HTMLButtonElement || null,
    refresh: document.querySelector('.ivu-icon-md-refresh')?.closest('button') as HTMLButtonElement || null
  };
}
