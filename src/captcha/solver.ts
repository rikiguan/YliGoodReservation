/**
 * Core CAPTCHA solving algorithm
 */
import { ImageData, MaxLocation, SliceResult, ProcessedAlpha } from './types';

export class CaptchaSolver {
  static findPuzzlePosition(background: HTMLImageElement, puzzle: HTMLImageElement, visualize: boolean = false): number {
    // Create canvases for processing
    const bgCanvas = document.createElement('canvas');
    const bgCtx = bgCanvas.getContext('2d');
    if (!bgCtx) throw new Error('Failed to get 2D context for background canvas');
    
    bgCanvas.width = background.width;
    bgCanvas.height = background.height;
    bgCtx.drawImage(background, 0, 0);
    
    const puzzleCanvas = document.createElement('canvas');
    const puzzleCtx = puzzleCanvas.getContext('2d');
    if (!puzzleCtx) throw new Error('Failed to get 2D context for puzzle canvas');
    
    puzzleCanvas.width = puzzle.width;
    puzzleCanvas.height = puzzle.height;
    puzzleCtx.drawImage(puzzle, 0, 0);
    
    // Get image data
    const bgData = bgCtx.getImageData(0, 0, bgCanvas.width, bgCanvas.height);
    const puzzleData = puzzleCtx.getImageData(0, 0, puzzleCanvas.width, puzzleCanvas.height);
    
    // Convert to grayscale and process alpha channel
    const bgGray = this.convertToGrayscale(bgData);
    const { puzzleGray, mask } = this.processAlphaChannel(puzzleData);
    
    // Extract horizontal slice similar to the Python implementation
    const { sliceGray, sliceMask } = this.extractHorizontalSlice(
      puzzleGray, 
      mask, 
      puzzleCanvas.width, 
      puzzleCanvas.height
    );
    
    // Find best match position using template matching
    const result = this.templateMatching(
      bgGray, 
      sliceGray || puzzleGray, 
      sliceMask || mask, 
      bgCanvas.width, bgCanvas.height, 
      puzzleCanvas.width, 
      sliceGray ? Math.floor(sliceGray.length / puzzleCanvas.width) : puzzleCanvas.height
    );
    
    // Get the position of the maximum correlation
    const maxLoc = this.findMaxLocation(result, bgCanvas.width - puzzleCanvas.width + 1);
    const xPosition = maxLoc.x;
    
    if (visualize) {
      console.log(`Puzzle position found: ${xPosition}px`);
    }
    
    return xPosition;
  }
  
  static extractHorizontalSlice(puzzleGray: Uint8Array, mask: Uint8Array, width: number, height: number): SliceResult {
    // Find non-transparent rows
    const nonTransparentRows: number[] = [];
    for (let i = 0; i < height; i++) {
      const rowStart = i * width;
      for (let j = 0; j < width; j++) {
        if (mask[rowStart + j]) {
          nonTransparentRows.push(i);
          break;
        }
      }
    }
    
    if (nonTransparentRows.length === 0) {
      return { sliceGray: null, sliceMask: null };
    }
    
    // Calculate middle row and slice height
    const middleRow = nonTransparentRows[Math.floor(nonTransparentRows.length / 2)];
    const sliceHeight = nonTransparentRows.length;
    const startRow = Math.max(0, middleRow - Math.floor(sliceHeight / 2));
    const endRow = Math.min(height, startRow + sliceHeight);
    
    // Extract slice
    const sliceGray = new Uint8Array(width * (endRow - startRow));
    const sliceMask = new Uint8Array(width * (endRow - startRow));
    
    for (let i = startRow, idx = 0; i < endRow; i++) {
      for (let j = 0; j < width; j++, idx++) {
        const originalIdx = i * width + j;
        sliceGray[idx] = puzzleGray[originalIdx];
        sliceMask[idx] = mask[originalIdx];
      }
    }
    
    return { sliceGray, sliceMask };
  }

  static convertToGrayscale(imageData: ImageData): Uint8Array {
    const data = imageData.data;
    const gray = new Uint8Array(imageData.width * imageData.height);
    
    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      gray[j] = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
    }
    
    return gray;
  }

  static processAlphaChannel(imageData: ImageData): ProcessedAlpha {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const gray = new Uint8Array(width * height);
    const mask = new Uint8Array(width * height);
    
    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      gray[j] = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
      mask[j] = data[i + 3] > 0 ? 1 : 0;
    }
    
    return { puzzleGray: gray, mask };
  }

  static templateMatching(
    image: Uint8Array, 
    template: Uint8Array, 
    mask: Uint8Array, 
    imgWidth: number, 
    imgHeight: number, 
    tplWidth: number, 
    tplHeight: number
  ): Float32Array {
    const result = new Float32Array((imgWidth - tplWidth + 1) * (imgHeight - tplHeight + 1));
    
    for (let y = 0; y <= imgHeight - tplHeight; y++) {
      for (let x = 0; x <= imgWidth - tplWidth; x++) {
        let sum = 0;
        let count = 0;
        
        for (let ty = 0; ty < tplHeight; ty++) {
          for (let tx = 0; tx < tplWidth; tx++) {
            const templateIdx = ty * tplWidth + tx;
            if (mask[templateIdx]) {
              const imgIdx = (y + ty) * imgWidth + (x + tx);
              const diff = image[imgIdx] - template[templateIdx];
              sum += diff * diff;
              count++;
            }
          }
        }
        
        result[y * (imgWidth - tplWidth + 1) + x] = count > 0 ? -Math.sqrt(sum / count) : 0;
      }
    }
    
    return result;
  }

  static findMaxLocation(result: Float32Array, width: number): MaxLocation {
    let maxVal = -Infinity;
    let maxLoc: MaxLocation = { x: 0, y: 0 };
    
    for (let i = 0; i < result.length; i++) {
      if (result[i] > maxVal) {
        maxVal = result[i];
        maxLoc.x = i % width;
        maxLoc.y = Math.floor(i / width);
      }
    }
    
    return maxLoc;
  }
  
  static solveFromBase64(backgroundBase64: string, puzzleBase64: string, callback: (position: number) => void): void {
    const bgImage = new Image();
    const puzzleImage = new Image();
    let imagesLoaded = 0;
    
    const checkAllLoaded = () => {
      if (imagesLoaded === 2) {
        const xPosition = this.findPuzzlePosition(bgImage, puzzleImage, true);
        callback(xPosition);
      }
    };
    
    bgImage.onload = function() {
      imagesLoaded++;
      checkAllLoaded();
    };
    
    puzzleImage.onload = function() {
      imagesLoaded++;
      checkAllLoaded();
    };
    
    bgImage.src = backgroundBase64.startsWith('data:') ? backgroundBase64 : 'data:image/png;base64,' + backgroundBase64;
    puzzleImage.src = puzzleBase64.startsWith('data:') ? puzzleBase64 : 'data:image/png;base64,' + puzzleBase64;
  }
}
