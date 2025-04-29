/**
 * Type definitions for the CAPTCHA solver
 */

export interface ImageData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export interface MaxLocation {
  x: number;
  y: number;
}

export interface SliceResult {
  sliceGray: Uint8Array | null;
  sliceMask: Uint8Array | null;
}

export interface ProcessedAlpha {
  puzzleGray: Uint8Array;
  mask: Uint8Array;
}

export interface CaptchaResponse {
  data: {
    repCode: string;
    repData?: {
      originalImageBase64: string;
      jigsawImageBase64: string;
    }
  }
}
