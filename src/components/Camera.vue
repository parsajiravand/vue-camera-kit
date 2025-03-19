<template>
  <div class="vue-camera-kit" :class="{ 'is-recording': isRecording }">
    <template v-if="hasGetUserMedia">
      <video
        ref="videoRef"
        :width="width"
        :height="height"
        autoplay
        playsinline
        webkit-playsinline
        muted
        :style="videoStyles"
        @loadedmetadata="onVideoLoaded"
      />

      <CameraOverlay
        v-if="showOverlay"
        :show-grid="showGrid"
        :grid-type="gridType"
        :aspect-ratio="aspectRatio"
        :watermark="watermark"
        :watermark-alt="watermarkAlt"
        :watermark-position="watermarkPosition"
        :watermark-size="watermarkSize"
      />

      <div class="camera-controls">
        <!-- Camera Switch Button -->
        <button
          v-if="availableCameras.length > 1"
          class="control-btn switch-camera"
          @click="switchCamera"
          :disabled="isRecording"
        >
          <span class="icon">🔄</span>
        </button>

        <!-- Grid Toggle Button -->
        <button
          v-if="showGridButton"
          class="control-btn toggle-grid"
          @click="toggleGrid"
          :class="{ active: showGrid }"
        >
          <span class="icon">⊞</span>
        </button>

        <!-- Aspect Ratio Button -->
        <button
          v-if="showAspectRatioButton"
          class="control-btn aspect-ratio"
          @click="cycleAspectRatio"
        >
          <span class="icon">⊡</span>
        </button>

        <!-- Photo Capture Button -->
        <button
          class="control-btn capture-photo"
          @click="capturePhoto"
          :disabled="isRecording"
        >
          <span class="icon">📸</span>
        </button>

        <!-- Video Recording Button -->
        <button
          class="control-btn record-video"
          @click="toggleRecording"
          :class="{ 'is-recording': isRecording }"
        >
          <span class="icon">🎥</span>
        </button>
      </div>

      <!-- Preview Modal -->
      <div v-if="showPreview" class="preview-modal">
        <div class="preview-content">
          <img
            v-if="lastCaptureType === 'photo'"
            :src="lastCapture"
            alt="Captured photo"
          />
          <video v-else :src="lastCapture" controls />
          <div class="preview-controls">
            <button @click="acceptCapture">Accept</button>
            <button @click="retakeCapture">Retake</button>
          </div>
        </div>
      </div>
    </template>
    <ErrorMessage
      v-else
      message="Camera access is not supported in this browser"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, defineComponent } from 'vue';
import { useDevicesList } from '@vueuse/core';
import CameraOverlay from './CameraOverlay.vue';
import type { CameraProps, AspectRatio } from '../types';

interface Props extends CameraProps {
  showOverlay?: boolean;
  showGridButton?: boolean;
  showAspectRatioButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: 640,
  height: 480,
  facingMode: 'environment',
  photoQuality: 0.92,
  videoConstraints: () => ({}),
  showPreviewByDefault: true,
  showGrid: false,
  gridType: 'rule-of-thirds',
  aspectRatio: 'original',
  watermarkPosition: 'bottom-right',
  watermarkSize: 20,
  showOverlay: true,
  showGridButton: true,
  showAspectRatioButton: true
});

const emit = defineEmits<{
  (e: 'photo-captured', data: { dataUrl: string; blob: Blob }): void;
  (e: 'video-started'): void;
  (e: 'video-stopped', data: { blob: Blob }): void;
  (e: 'error', error: Error): void;
}>();

// Refs
const videoRef = ref<HTMLVideoElement | null>(null);
const mediaStream = ref<MediaStream | null>(null);
const mediaRecorder = ref<MediaRecorder | null>(null);
const isRecording = ref(false);
const recordedChunks = ref<Blob[]>([]);
const lastCapture = ref<string>("");
const lastCaptureType = ref<"photo" | "video">("photo");
const showPreview = ref(false);

// Camera devices
useDevicesList({
  requestPermissions: true,
  onUpdated() {
    initializeCamera();
  },
});
const availableCameras = ref<MediaDeviceInfo[]>([]);

// New refs for customization features
const showGrid = ref(props.showGrid);
const currentAspectRatio = ref(props.aspectRatio);

// Create a ref for facingMode to handle camera switching
const currentFacingMode = ref(props.facingMode);

// Add these to your setup
const hasGetUserMedia = computed(() => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
});

// Add ErrorMessage component
const ErrorMessage = defineComponent({
  props: {
    message: {
      type: String,
      required: true
    }
  },
  template: `
    <div class="camera-error">
      <p>{{ message }}</p>
    </div>
  `
});

// Initialize camera
const initializeCamera = async () => {
  try {
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: currentFacingMode.value,
        width: { ideal: props.width },
        height: { ideal: props.height },
        ...props.videoConstraints,
      },
      audio: true
    };

    // Stop any existing streams
    if (mediaStream.value) {
      mediaStream.value.getTracks().forEach(track => track.stop());
    }

    // Request both video and audio permissions explicitly
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    mediaStream.value = stream;

    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      videoRef.value.setAttribute('playsinline', '');
      videoRef.value.setAttribute('webkit-playsinline', '');
      await videoRef.value.play();
    }

  } catch (error) {
    console.error('Camera initialization error:', error);
    emit('error', error as Error);
  }
};

// Improved camera switching function
const switchCamera = async () => {
  try {
    if (availableCameras.value.length <= 1) return;

    // Toggle facing mode using the ref instead of props
    currentFacingMode.value = currentFacingMode.value === 'user' ? 'environment' : 'user';

    // Stop current stream
    if (mediaStream.value) {
      mediaStream.value.getTracks().forEach(track => track.stop());
    }

    // Get new stream with updated facing mode
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: currentFacingMode.value,
        width: { ideal: props.width },
        height: { ideal: props.height },
        ...props.videoConstraints,
      },
      audio: true,
    };

    mediaStream.value = await navigator.mediaDevices.getUserMedia(constraints);
    
    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream.value;
      await videoRef.value.play();
    }

  } catch (error) {
    console.error('Camera switch error:', error);
    emit('error', error as Error);
  }
};

// Grid toggle
const toggleGrid = () => {
  showGrid.value = !showGrid.value;
};

// Aspect ratio cycling
const aspectRatios: AspectRatio[] = [
  'original',
  'aspect-1-1',
  'aspect-16-9',
  'aspect-4-3',
  'aspect-3-2'
];
const cycleAspectRatio = () => {
  const currentIndex = aspectRatios.indexOf(currentAspectRatio.value);
  const nextIndex = (currentIndex + 1) % aspectRatios.length;
  currentAspectRatio.value = aspectRatios[nextIndex];
};

// Photo capture
const capturePhoto = () => {
  if (!videoRef.value) return;

  const canvas = document.createElement('canvas');
  canvas.width = videoRef.value.videoWidth;
  canvas.height = videoRef.value.videoHeight;

  const context = canvas.getContext('2d');
  if (!context) return;

  context.drawImage(videoRef.value, 0, 0);

  const dataUrl = canvas.toDataURL('image/jpeg', props.photoQuality);
  canvas.toBlob(
    (blob) => {
      if (!blob) return;

      lastCapture.value = dataUrl;
      lastCaptureType.value = 'photo';
      showPreview.value = props.showPreviewByDefault;

      emit('photo-captured', { dataUrl, blob });
    },
    'image/jpeg',
    props.photoQuality
  );
};

// Video recording
const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
};

const startRecording = async () => {
  if (!mediaStream.value) return;

  try {
    // Set up recording options with proper MIME type and codecs for iOS
    const options: MediaRecorderOptions = {
      mimeType: getSupportedMimeType(),
      videoBitsPerSecond: 2500000, // 2.5 Mbps
    };

    recordedChunks.value = [];
    mediaRecorder.value = new MediaRecorder(mediaStream.value, options);

    mediaRecorder.value.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        recordedChunks.value.push(event.data);
      }
    };

    mediaRecorder.value.onstop = () => {
      const blob = new Blob(recordedChunks.value, {
        type: mediaRecorder.value?.mimeType || 'video/webm'
      });
      emit('video-stopped', { blob });
      isRecording.value = false;
    };

    mediaRecorder.value.start();
    isRecording.value = true;
    emit('video-started');
  } catch (error) {
    console.error('Recording error:', error);
    emit('error', error as Error);
  }
};

// Helper function to get supported MIME type
const getSupportedMimeType = (): string => {
  const types = [
    'video/webm;codecs=h264',
    'video/webm',
    'video/mp4',
    'video/mp4;codecs=h264',
    'video/webm;codecs=vp8,opus',
  ];

  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  // Fallback
  return 'video/webm';
};

const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop();
    isRecording.value = false;
  }
};

// Preview handlers
const acceptCapture = () => {
  showPreview.value = false;
};

const retakeCapture = () => {
  showPreview.value = false;
  lastCapture.value = "";
  if (lastCaptureType.value === "video") {
    recordedChunks.value = [];
  }
};

// Lifecycle
onMounted(() => {
  initializeCamera();
});

onBeforeUnmount(() => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop();
  }
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop());
  }
});

const onVideoLoaded = () => {
  // Video element is ready
};

// Add iOS specific styles
const videoStyles = computed(() => ({
  transform: currentFacingMode.value === 'user' ? 'scaleX(-1)' : 'none',
  width: '100%',
  height: 'auto',
  maxWidth: '100%',
  objectFit: 'cover' as const,
}));

defineExpose({});
</script>

<style scoped>
.vue-camera-kit {
  position: relative;
  width: 100%;
  max-width: v-bind('width + "px"');
  margin: 0 auto;
  overflow: hidden;
  background: #000;
  border-radius: 8px;
}

/* Remove default transform and add it conditionally through videoStyles */
.vue-camera-kit video {
  width: 100%;
  height: auto;
  max-width: 100%;
  object-fit: cover;
}

.vue-camera-kit.is-recording video {
  border: 2px solid red;
}

.camera-controls {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px;
}

.control-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: scale(1.1);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn.record-video.is-recording {
  background: rgba(255, 0, 0, 0.8);
}

.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.preview-content {
  max-width: 90%;
  max-height: 90vh;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.preview-content img,
.preview-content video {
  max-width: 100%;
  max-height: 70vh;
}

.preview-controls {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.preview-controls button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}

.preview-controls button:hover {
  background: #0056b3;
}

.control-btn.active {
  background: rgba(0, 123, 255, 0.8);
  color: white;
}

.control-btn.toggle-grid .icon,
.control-btn.aspect-ratio .icon {
  font-size: 24px;
}

/* Mobile-specific styles */
@media (max-width: 768px) {
  .camera-controls {
    padding: 15px;
    gap: 15px;
  }

  .control-btn {
    width: 50px;
    height: 50px;
  }
}

/* iOS-specific fixes */
@supports (-webkit-touch-callout: none) {
  .vue-camera-kit video {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
