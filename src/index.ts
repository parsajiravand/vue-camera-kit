import type { App } from 'vue'
import Camera from './components/Camera.vue'
import CameraOverlay from './components/CameraOverlay.vue'

export { Camera, CameraOverlay }
export * from './types'

// Vue plugin installation
export default {
  install: (app: App): void => {
    app.component('Camera', Camera)
    app.component('CameraOverlay', CameraOverlay)
  }
}

// Type exports
export interface CameraProps {
  width?: number
  height?: number
  facingMode?: 'user' | 'environment'
  photoQuality?: number
  videoConstraints?: MediaTrackConstraints
  showPreviewByDefault?: boolean
}

export interface PhotoCaptureData {
  dataUrl: string
  blob: Blob
}

export interface VideoCaptureData {
  blob: Blob
} 