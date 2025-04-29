/**
 * UI样式定义
 */

interface StyleObject {
  [key: string]: string;
}

export const containerStyle: StyleObject = {
  position: 'fixed',
  top: '10px',
  right: '10px',
  zIndex: '9999',
  display: 'flex',
  flexDirection: 'column',
  gap: '5px'
};

export const buttonBaseStyle: StyleObject = {
  padding: '8px 12px',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export const scanButtonStyle: StyleObject = {
  ...buttonBaseStyle,
  backgroundColor: '#4CAF50'
};

export const autoScanActiveButtonStyle: StyleObject = {
  ...buttonBaseStyle,
  backgroundColor: '#F44336'
};

export const autoScanInactiveButtonStyle: StyleObject = {
  ...buttonBaseStyle,
  backgroundColor: '#2196F3'
};

export const labelStyle: StyleObject = {
  marginTop: '5px',
  color: '#333',
  fontWeight: 'bold'
};

export const inputStyle: StyleObject = {
  padding: '5px',
  width: '100%',
  marginBottom: '5px'
};

export const noteStyle: StyleObject = {
  fontSize: '10px',
  color: '#666',
  marginBottom: '5px'
};

// 应用样式到元素
export function applyStyles(element: HTMLElement, styles: StyleObject): void {
  Object.assign(element.style, styles);
}
