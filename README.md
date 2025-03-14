# Vue Camera Kit

A versatile Vue 3 camera component for capturing photos and videos with advanced features.

## Features

- 📸 Photo Capture
- 🎥 Video Recording
- 🔄 Camera Switching (Front/Back)
- 📏 Customizable Resolution
- 🖼️ Preview & Retake
- 🎨 Modern UI with Customizable Styling

## Installation

```bash
npm install vue-camera-kit
# or
yarn add vue-camera-kit
```

## Usage

### Global Registration

```typescript
import { createApp } from 'vue'
import VueCameraKit from 'vue-camera-kit'
import App from './App.vue'

const app = createApp(App)
app.use(VueCameraKit)
app.mount('#app')
```

### Local Registration

```vue
<script setup lang="ts">
import { Camera } from 'vue-camera-kit'
</script>

<template>
  <Camera
    :width="640"
    :height="480"
    facing-mode="environment"
    :photo-quality="0.92"
    @photo-captured="onPhotoCaptured"
    @video-stopped="onVideoStopped"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| width | number | 640 | Camera viewport width |
| height | number | 480 | Camera viewport height |
| facingMode | 'user' \| 'environment' | 'environment' | Camera facing mode |
| photoQuality | number | 0.92 | JPEG quality (0-1) |
| videoConstraints | MediaTrackConstraints | {} | Additional video constraints |
| showPreviewByDefault | boolean | true | Show preview after capture |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| photo-captured | { dataUrl: string, blob: Blob } | Emitted when photo is captured |
| video-started | - | Emitted when video recording starts |
| video-stopped | { blob: Blob } | Emitted when video recording stops |
| error | Error | Emitted on camera/recording errors |

## Example

```vue
<script setup lang="ts">
import { Camera } from 'vue-camera-kit'
import type { PhotoCaptureData, VideoCaptureData } from 'vue-camera-kit'

const onPhotoCaptured = ({ dataUrl, blob }: PhotoCaptureData) => {
  // Handle captured photo
  console.log('Photo captured:', { dataUrl, blob })
}

const onVideoStopped = ({ blob }: VideoCaptureData) => {
  // Handle recorded video
  console.log('Video recorded:', { blob })
}
</script>

<template>
  <Camera
    :width="1280"
    :height="720"
    facing-mode="user"
    :photo-quality="0.95"
    @photo-captured="onPhotoCaptured"
    @video-stopped="onVideoStopped"
    @error="(error) => console.error(error)"
  />
</template>
```

## Styling

The component comes with default styling but can be customized using CSS variables or overriding classes:

```css
.vue-camera-kit {
  /* Custom styles */
}

.camera-controls {
  /* Custom control styles */
}

.control-btn {
  /* Custom button styles */
}
```

## Browser Support

- Chrome (Desktop & Mobile)
- Firefox (Desktop & Mobile)
- Safari (Desktop & Mobile)
- Edge (Desktop & Mobile)

## License

MIT License 