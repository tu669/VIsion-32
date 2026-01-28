import { useState, useCallback, useRef } from 'react';

export type FilterType =
  | 'grayscale'
  | 'blackwhite'
  | 'brightness'
  | 'contrast'
  | 'saturation'
  | 'sharpen'
  | 'blur'
  | 'edge'
  | 'invert'
  | 'enhance'
  | 'segment';

export interface UploadedImageData {
  name: string;
  size: number;
  width: number;
  height: number;
}

export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  threshold: number;
  blur: number;
  sharpen: number;
}

export interface RGBSettings {
  red: number;
  green: number;
  blue: number;
}

export const useImageProcessing = () => {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [imageData, setImageData] = useState<UploadedImageData | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    threshold: 128,
    blur: 1,
    sharpen: 1,
  });
  const [rgbSettings, setRgbSettings] = useState<RGBSettings>({
    red: 0,
    green: 0,
    blue: 0,
  });

  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const processedCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = useCallback((file: File) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        setOriginalImage(img);
        setImageData({
          name: file.name,
          size: file.size,
          width: img.width,
          height: img.height,
        });

        // Draw original image on canvas
        const canvas = originalCanvasRef.current;
        if (canvas) {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
          }
        }
      };
      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  }, []);

  const applyGrayscale = (canvasImageData: globalThis.ImageData) => {
    const data = canvasImageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = data[i + 1] = data[i + 2] = gray;
    }
    return canvasImageData;
  };

  const applyBlackWhite = (canvasImageData: globalThis.ImageData, threshold: number) => {
    const data = canvasImageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const bw = gray > threshold ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = bw;
    }
    return canvasImageData;
  };

  const applyBrightness = (canvasImageData: globalThis.ImageData, brightness: number) => {
    const data = canvasImageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, data[i] + brightness));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightness));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightness));
    }
    return canvasImageData;
  };

  const applyContrast = (canvasImageData: globalThis.ImageData, contrast: number) => {
    const data = canvasImageData.data;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
      data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
    }
    return canvasImageData;
  };

  const applySaturation = (canvasImageData: globalThis.ImageData, saturation: number) => {
    const data = canvasImageData.data;
    const factor = (saturation + 100) / 100;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = Math.min(255, Math.max(0, gray + factor * (data[i] - gray)));
      data[i + 1] = Math.min(255, Math.max(0, gray + factor * (data[i + 1] - gray)));
      data[i + 2] = Math.min(255, Math.max(0, gray + factor * (data[i + 2] - gray)));
    }
    return canvasImageData;
  };

  const applyBlur = (canvasImageData: globalThis.ImageData, radius: number) => {
    const data = canvasImageData.data;
    const width = canvasImageData.width;
    const height = canvasImageData.height;
    const output = new Uint8ClampedArray(data);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, count = 0;
        
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const idx = (ny * width + nx) * 4;
              r += data[idx];
              g += data[idx + 1];
              b += data[idx + 2];
              count++;
            }
          }
        }
        
        const idx = (y * width + x) * 4;
        output[idx] = r / count;
        output[idx + 1] = g / count;
        output[idx + 2] = b / count;
      }
    }

    for (let i = 0; i < data.length; i += 4) {
      data[i] = output[i];
      data[i + 1] = output[i + 1];
      data[i + 2] = output[i + 2];
    }

    return canvasImageData;
  };

  const applySharpen = (canvasImageData: globalThis.ImageData, amount: number) => {
    const data = canvasImageData.data;
    const width = canvasImageData.width;
    const height = canvasImageData.height;
    const output = new Uint8ClampedArray(data);

    const kernel = [
      0, -amount, 0,
      -amount, 1 + 4 * amount, -amount,
      0, -amount, 0
    ];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4 + c;
              sum += data[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
            }
          }
          const idx = (y * width + x) * 4 + c;
          output[idx] = Math.min(255, Math.max(0, sum));
        }
      }
    }

    for (let i = 0; i < data.length; i += 4) {
      data[i] = output[i];
      data[i + 1] = output[i + 1];
      data[i + 2] = output[i + 2];
    }

    return canvasImageData;
  };

  const applyEdgeDetection = (canvasImageData: globalThis.ImageData) => {
    const data = canvasImageData.data;
    const width = canvasImageData.width;
    const height = canvasImageData.height;
    const output = new Uint8ClampedArray(data);

    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gx = 0, gy = 0;
        
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
            gx += gray * sobelX[(ky + 1) * 3 + (kx + 1)];
            gy += gray * sobelY[(ky + 1) * 3 + (kx + 1)];
          }
        }
        
        const magnitude = Math.sqrt(gx * gx + gy * gy);
        const idx = (y * width + x) * 4;
        output[idx] = output[idx + 1] = output[idx + 2] = Math.min(255, magnitude);
      }
    }

    for (let i = 0; i < data.length; i += 4) {
      data[i] = output[i];
      data[i + 1] = output[i + 1];
      data[i + 2] = output[i + 2];
    }

    return canvasImageData;
  };

  const applyInvert = (canvasImageData: globalThis.ImageData) => {
    const data = canvasImageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
    return canvasImageData;
  };

  const applyEnhance = (canvasImageData: globalThis.ImageData) => {
    // Apply a combination of contrast and saturation
    applyContrast(canvasImageData, 20);
    applySaturation(canvasImageData, 20);
    return canvasImageData;
  };

  const applyRGB = (canvasImageData: globalThis.ImageData, rgb: RGBSettings) => {
    const data = canvasImageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, data[i] + rgb.red));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + rgb.green));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + rgb.blue));
    }
    return canvasImageData;
  };

  const processImage = useCallback((mode: 'filter' | 'rgb') => {
    const originalCanvas = originalCanvasRef.current;
    const processedCanvas = processedCanvasRef.current;

    if (!originalCanvas || !processedCanvas || !originalImage) return;

    const ctx = processedCanvas.getContext('2d');
    if (!ctx) return;

    processedCanvas.width = originalImage.width;
    processedCanvas.height = originalImage.height;

    // Draw original image first
    ctx.drawImage(originalImage, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, originalImage.width, originalImage.height);

    if (mode === 'filter' && activeFilter) {
      switch (activeFilter) {
        case 'grayscale':
          applyGrayscale(imageData);
          break;
        case 'blackwhite':
          applyBlackWhite(imageData, filterSettings.threshold);
          break;
        case 'brightness':
          applyBrightness(imageData, filterSettings.brightness);
          break;
        case 'contrast':
          applyContrast(imageData, filterSettings.contrast);
          break;
        case 'saturation':
          applySaturation(imageData, filterSettings.saturation);
          break;
        case 'blur':
          applyBlur(imageData, filterSettings.blur);
          break;
        case 'sharpen':
          applySharpen(imageData, filterSettings.sharpen);
          break;
        case 'edge':
          applyEdgeDetection(imageData);
          break;
        case 'invert':
          applyInvert(imageData);
          break;
        case 'enhance':
          applyEnhance(imageData);
          break;
        case 'segment':
          applyBlackWhite(imageData, filterSettings.threshold);
          break;
      }
    } else if (mode === 'rgb') {
      applyRGB(imageData, rgbSettings);
    }

    ctx.putImageData(imageData, 0, 0);
  }, [originalImage, activeFilter, filterSettings, rgbSettings]);

  const reset = useCallback(() => {
    setActiveFilter(null);
    setFilterSettings({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      threshold: 128,
      blur: 1,
      sharpen: 1,
    });
    setRgbSettings({
      red: 0,
      green: 0,
      blue: 0,
    });

    const processedCanvas = processedCanvasRef.current;
    if (processedCanvas && originalImage) {
      const ctx = processedCanvas.getContext('2d');
      if (ctx) {
        processedCanvas.width = originalImage.width;
        processedCanvas.height = originalImage.height;
        ctx.drawImage(originalImage, 0, 0);
      }
    }
  }, [originalImage]);

  const downloadImage = useCallback(() => {
    const canvas = processedCanvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `processed-${imageData?.name || 'image'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [imageData]);

  return {
    originalImage,
    imageData,
    activeFilter,
    setActiveFilter,
    filterSettings,
    setFilterSettings,
    rgbSettings,
    setRgbSettings,
    handleImageUpload,
    processImage,
    reset,
    downloadImage,
    originalCanvasRef,
    processedCanvasRef,
  };
};
