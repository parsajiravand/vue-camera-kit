export type GridType = 'rule-of-thirds' | 'golden-ratio' | 'center';
export type AspectRatio = 'original' | '1:1' | '16:9' | '4:3' | '3:2';
export type WatermarkPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

export interface FilterOptions {
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
  sepia: number;
  blur: number;
} 