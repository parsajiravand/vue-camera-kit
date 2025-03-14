<template>
  <div class="vue-camera-kit" :class="{ 'is-recording': isRecording }">
    <video
      ref="videoRef"
      :width="width"
      :height="height"
      autoplay
      playsinline
      muted
      @loadedmetadata="onVideoLoaded"
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useDevicesList } from "@vueuse/core";

interface Props {
  width?: number;
  height?: number;
  facingMode?: "user" | "environment";
  photoQuality?: number;
  videoConstraints?: MediaTrackConstraints;
  showPreviewByDefault?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: 640,
  height: 480,
  facingMode: "environment",
  photoQuality: 0.92,
  videoConstraints: () => ({}),
  showPreviewByDefault: true,
});

const emit = defineEmits<{
  (e: "photo-captured", data: { dataUrl: string; blob: Blob }): void;
  (e: "video-started"): void;
  (e: "video-stopped", data: { blob: Blob }): void;
  (e: "error", error: Error): void;
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
const { devices: cameras } = useDevicesList({
  navigator: navigator,
  requestPermissions: true,
  constraints: { video: true },
});
const availableCameras = ref<MediaDeviceInfo[]>([]);
const currentCameraIndex = ref(0);

// Initialize camera
const initializeCamera = async () => {
  try {
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: props.facingMode,
        width: { ideal: props.width },
        height: { ideal: props.height },
        ...props.videoConstraints,
      },
      audio: false,
    };

    mediaStream.value = await navigator.mediaDevices.getUserMedia(constraints);
    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream.value;
    }

    // Update available cameras
    availableCameras.value = cameras.value.filter(
      (device) => device.kind === "videoinput"
    );
  } catch (error) {
    emit("error", error as Error);
  }
};

// Switch camera
const switchCamera = async () => {
  if (availableCameras.value.length <= 1) return;

  currentCameraIndex.value =
    (currentCameraIndex.value + 1) % availableCameras.value.length;

  // Stop current stream
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop());
  }

  // Reinitialize with new camera
  await initializeCamera();
};

// Photo capture
const capturePhoto = () => {
  if (!videoRef.value) return;

  const canvas = document.createElement("canvas");
  canvas.width = videoRef.value.videoWidth;
  canvas.height = videoRef.value.videoHeight;

  const context = canvas.getContext("2d");
  if (!context) return;

  context.drawImage(videoRef.value, 0, 0);

  const dataUrl = canvas.toDataURL("image/jpeg", props.photoQuality);
  canvas.toBlob(
    (blob) => {
      if (!blob) return;

      lastCapture.value = dataUrl;
      lastCaptureType.value = "photo";
      showPreview.value = props.showPreviewByDefault;

      emit("photo-captured", { dataUrl, blob });
    },
    "image/jpeg",
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

const startRecording = () => {
  if (!mediaStream.value) return;

  recordedChunks.value = [];
  mediaRecorder.value = new MediaRecorder(mediaStream.value, {
    mimeType: "video/webm;codecs=vp9",
  });

  mediaRecorder.value.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.value.push(event.data);
    }
  };

  mediaRecorder.value.onstop = () => {
    const blob = new Blob(recordedChunks.value, { type: "video/webm" });
    lastCapture.value = URL.createObjectURL(blob);
    lastCaptureType.value = "video";
    showPreview.value = props.showPreviewByDefault;

    emit("video-stopped", { blob });
  };

  mediaRecorder.value.start();
  isRecording.value = true;
  emit("video-started");
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

onUnmounted(() => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop());
  }
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop();
  }
});

const onVideoLoaded = () => {
  // Video element is ready
};

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

.vue-camera-kit video {
  width: 100%;
  height: auto;
  transform: scaleX(-1); /* Mirror effect for front camera */
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
</style>
