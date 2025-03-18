// Camera types
export type GridType = 'rule-of-thirds' | 'golden-ratio' | 'center';
export type AspectRatio = 'original' | 'aspect-16-9' | 'aspect-4-3' | 'aspect-1-1' | 'aspect-3-2';
export type WatermarkPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

// Props interface
export interface CameraProps {
  width?: number;
  height?: number;
  facingMode?: 'user' | 'environment';
  photoQuality?: number;
  videoConstraints?: MediaTrackConstraints;
  showPreviewByDefault?: boolean;
  showGrid?: boolean;
  gridType?: GridType;
  aspectRatio?: AspectRatio;
  watermark?: string;
  watermarkAlt?: string;
  watermarkPosition?: WatermarkPosition;
  watermarkSize?: number;
  // ... other props
}

// Event payload types
export interface PhotoCaptureData {
  dataUrl: string;
  blob: Blob;
}

export interface VideoCaptureData {
  blob: Blob;
} 