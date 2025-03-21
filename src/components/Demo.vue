<template>
  <div class="demo-container">
    <Header />

    <div class="camera-container">
      <Camera
        :show-grid="true"
        grid-type="rule-of-thirds"
        aspect-ratio="16:9"
        :watermark="'https://i.postimg.cc/258CSGbV/vue3-form-wizard-icon.png'"
        watermark-position="top-right"
        :watermark-size="20"
        :show-grid-button="true"
        :show-aspect-ratio-button="true"
        @photo-captured="onPhotoCaptured"
        @video-started="onVideoStarted"
        @video-stopped="onVideoStopped"
      />
    </div>

    <div v-if="captures.length > 0" class="captures-gallery">
      <h2>Captured Media</h2>
      <div class="gallery-grid">
        <div
          v-for="(capture, index) in captures"
          :key="index"
          class="capture-item"
        >
          <img
            v-if="capture.type === 'photo'"
            :src="capture.data"
            alt="Captured photo"
          />
          <video v-else :src="capture.data" controls />
          <div class="capture-actions">
            <button @click="downloadCapture(capture)">Download</button>
            <button @click="deleteCapture(index)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import { Camera } from "../index";
import Header from "./Header.vue";
import type { PhotoCaptureData, VideoCaptureData } from "../index";

interface Capture {
  type: "photo" | "video";
  data: string;
  blob: Blob;
}

// Camera settings
const selectedResolution = ref("1280x720");

// Computed camera dimensions
const dimensions = computed(() => {
  const [width, height] = selectedResolution.value.split("x");
  return {
    width: parseInt(width),
    height: parseInt(height),
  };
});

const cameraWidth = computed(() => dimensions.value.width);
const cameraHeight = computed(() => dimensions.value.height);

// Video constraints
const videoConstraints = computed(() => ({
  width: { ideal: cameraWidth.value },
  height: { ideal: cameraHeight.value },
}));

// Captures storage
const captures = ref<Capture[]>([]);

// Event handlers
const onPhotoCaptured = ({ dataUrl, blob }: PhotoCaptureData) => {
  captures.value.unshift({
    type: "photo",
    data: dataUrl,
    blob,
  });
};

const onVideoStarted = () => {
  console.log("Video recording started");
};

const onVideoStopped = ({ blob }: VideoCaptureData) => {
  const url = URL.createObjectURL(blob);
  captures.value.unshift({
    type: "video",
    data: url,
    blob,
  });
};

const onError = (error: Error) => {
  console.error("Camera error:", error);
  alert(`Camera error: ${error.message}`);
};

// Capture management
const downloadCapture = (capture: Capture) => {
  const a = document.createElement("a");
  a.href = capture.data;
  a.download = `capture-${Date.now()}.${
    capture.type === "photo" ? "jpg" : "webm"
  }`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const deleteCapture = (index: number) => {
  const capture = captures.value[index];
  if (capture.type === "video") {
    URL.revokeObjectURL(capture.data);
  }
  captures.value.splice(index, 1);
};

// Cleanup
onUnmounted(() => {
  captures.value.forEach((capture) => {
    if (capture.type === "video") {
      URL.revokeObjectURL(capture.data);
    }
  });
});

defineExpose({});
</script>

<style scoped>
.demo-container {
  max-width: 1200px;
  margin: 0 auto;
}

h1,
h2 {
  color: #2c3e50;
  text-align: center;
}

.camera-container {
  margin: 20px auto;
  max-width: 100%;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.controls-panel {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.control-group {
  margin: 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-group label {
  min-width: 120px;
  font-weight: 500;
}

.control-group select,
.control-group input[type="range"] {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.captures-gallery {
  margin-top: 40px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.capture-item {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.capture-item img,
.capture-item video {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.capture-actions {
  padding: 10px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.capture-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.capture-actions button:hover {
  background: #0056b3;
}

.capture-actions button:last-child {
  background: #dc3545;
}

.capture-actions button:last-child:hover {
  background: #c82333;
}
</style>
