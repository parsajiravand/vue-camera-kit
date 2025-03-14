import { App } from 'vue'
import Camera from './components/Camera.vue'

export { Camera }

// Vue plugin installation
export default {
  install: (app: App): void => {
    app.component('Camera', Camera)
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