/**
 * DOM utilities for element selection
 */


/**
 * 场地选择页面
 */
interface ArrowButtons {
  right: HTMLElement | null;
  left: HTMLElement | null;
}

interface ActionButtons {
  forward: HTMLButtonElement | null;
  refresh: HTMLButtonElement | null;
}

// 获取所有空闲的预约区块
export function getFreeReservationBlocks(): NodeListOf<HTMLElement> {
  return document.querySelectorAll('div.reserveBlock.position.free[data-v-d61a26c0]');
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


/**
 * 订单确认页面
 */


// 获取"添加同伴"链接
export function getAddCompanionLink(): HTMLAnchorElement | null {
  // 查找包含"点击这里"和"添加同伴"文本的容器
  const containers = document.querySelectorAll('.ivu-form-item-content');
  for (const container of containers) {
    if (container.textContent?.includes('添加同伴')) {
      // 从容器中找到链接元素
      return container.querySelector('a[href="/venue/venues/buddies"]') as HTMLAnchorElement;
    }
  }
  return null;
}

// 获取同伴复选框
export function getCompanionCheckboxList(): NodeListOf<HTMLInputElement> | null {
  // 找到包含"添加同伴"文本的容器
  const container = document.querySelector('.ivu-form-item-content');
  if (container?.textContent?.includes('添加同伴')) {
    // 从容器中找到第一个复选框
    return container.querySelectorAll('.ivu-checkbox-input') as NodeListOf<HTMLInputElement>;
  }
  return null;
}

// 根据同伴名字获取对应的复选框
export function getCompanionCheckboxByName(name: string): HTMLInputElement | null {
  const labels = document.querySelectorAll('.ivu-checkbox-wrapper');
  for (const label of labels) {
    if (label.textContent?.trim().includes(name)) {
      return label.querySelector('.ivu-checkbox-input') as HTMLInputElement;
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

/**
 * 个人信息相关
 */

// 获取用户名称
export function getUserName(): string | null {
  const loginContent = document.querySelector('.isLoginContent');
  if (!loginContent) return null;
  
  // 查找包含用户名的div（带有特定margin样式的div）
  const nameDiv = loginContent.querySelector('div[style*="margin: 0px 10px"]');
  return nameDiv ? nameDiv.textContent?.trim() ?? null : null;
}


/**
 * 订单支付页面
 */

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


// 获取订单号
export function getOrderNumber(): string | null {
  const orderItems = document.querySelectorAll('div.payDetailItem');
  for (const item of orderItems) {
    const label = item.querySelector('.payLable');
    if (label?.textContent?.trim() === '订单号') {
      const orderNumberElement = item.querySelector('.payText');
      return orderNumberElement?.textContent?.trim() || null;
    }
  }
  return null;
}

// 获取订场信息
export function getOrderPlace(): string | null {
  const orderItems = document.querySelectorAll('div.payDetailItem');
  for (const item of orderItems) {
    const label = item.querySelector('.payLable');
    if (label?.textContent?.trim() === '订场信息') {
      const orderNumberElement = item.querySelector('.payText');
      return orderNumberElement?.textContent?.trim() || null;
    }
  }
  return null;
}

// 获取使用者
export function getOrderUser(): string | null {
  const orderItems = document.querySelectorAll('div.payDetailItem');
  for (const item of orderItems) {
    const label = item.querySelector('.payLable');
    if (label?.textContent?.trim() === '场地使用者') {
      const orderNumberElement = item.querySelector('.payText');
      return orderNumberElement?.textContent?.trim() || null;
    }
  }
  return null;
}

// 获取同伴信息
export function getOrderPartner() : string | null {
  const orderItems = document.querySelectorAll('div.payDetailItem');
  for (const item of orderItems) {
    const label = item.querySelector('.payLable');
    if (label?.textContent?.trim() === '同伴信息') {
      const orderNumberElement = item.querySelector('.payText');
      return orderNumberElement?.textContent?.trim() || null;
    }
  }
  return null;
}