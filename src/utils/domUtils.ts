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

// 获取"我要预约"按钮
export function getAppointmentButton(): HTMLElement | null {
  const elements = document.querySelectorAll('div.payHandleItem');
  for (const element of elements) {
    if (element.textContent?.trim() === '我要预约') {
      return element as HTMLElement;
    }
  }
  return null;
}

// 获取"提交订单"按钮
export function getSubmitAppointmentButton(): HTMLElement | null {
    const elements = document.querySelectorAll('div.payHandleItem');
    for (const element of elements) {
      if (element.textContent?.trim() === '提交订单') {
        return element as HTMLElement;
      }
    }
    return null;
}

// 获取"支付"按钮
export function getPayButton(): HTMLButtonElement | null {
  const buttons = document.querySelectorAll('button.ivu-btn.ivu-btn-primary');
  for (const button of buttons) {
    if (button.textContent?.trim() === '支付') {
      return button as HTMLButtonElement;
    }
  }
  return null;
}

// 根据标签文本获取复选框
export function getCheckboxByLabelText(text: string): HTMLInputElement | null {
  const labels = document.querySelectorAll('.ivu-checkbox-wrapper');
  for (const label of labels) {
    if (label.textContent?.trim().includes(text)) {
      return label.querySelector('.ivu-checkbox-input') as HTMLInputElement;
    }
  }
  return null;
}

// 获取"已阅读并同意"复选框
export function getAgreementCheckbox(): HTMLInputElement | null {
  return getCheckboxByLabelText('已阅读并同意');
}
