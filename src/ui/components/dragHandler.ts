/**
 * 实现控制面板拖动功能
 */
export function initDragFunctionality(controlPanelElement: HTMLElement): void {
  const controlPanel = controlPanelElement;
  const dragHandle = controlPanel.querySelector('.yligood-header');
  
  if (!dragHandle) {
    console.error('Drag handle element not found');
    return;
  }
  
  let isDragging = false;
  let offsetX: number, offsetY: number;
  
  // 开始拖动 - 修复类型声明
  dragHandle.addEventListener('mousedown', ((e: Event) => {
    const mouseEvent = e as MouseEvent;
    isDragging = true;
    controlPanel.classList.add('yligood-dragging');
    
    // 计算鼠标点击位置与面板左上角的偏移量
    const rect = controlPanel.getBoundingClientRect();
    offsetX = mouseEvent.clientX - rect.left;
    offsetY = mouseEvent.clientY - rect.top;
    
    // 防止文本被选中
    e.preventDefault();
  }) as EventListener);
  
  // 拖动中 - 修复类型声明
  document.addEventListener('mousemove', ((e: Event) => {
    if (!isDragging) return;
    
    const mouseEvent = e as MouseEvent;
    // 根据鼠标位置和初始偏移量计算新位置
    controlPanel.style.left = `${mouseEvent.clientX - offsetX}px`;
    controlPanel.style.top = `${mouseEvent.clientY - offsetY}px`;
    
    // 重置right定位，让left生效
    controlPanel.style.right = 'auto';
  }) as EventListener);
  
  // 结束拖动
  document.addEventListener('mouseup', (() => {
    if (isDragging) {
      isDragging = false;
      controlPanel.classList.remove('yligood-dragging');
    }
  }) as EventListener);
  
  // 如果鼠标离开窗口也结束拖动
  document.addEventListener('mouseleave', (() => {
    if (isDragging) {
      isDragging = false;
      controlPanel.classList.remove('yligood-dragging');
    }
  }) as EventListener);
}
