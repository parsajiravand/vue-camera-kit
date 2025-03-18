<template>
  <div class="camera-overlay">
    <!-- Grid overlay -->
    <div v-if="showGrid" class="grid-overlay" :class="[gridType, aspectRatio]"></div>
    
    <!-- Watermark -->
    <img
      v-if="watermark"
      :src="watermark"
      :alt="watermarkAlt || 'Watermark'"
      class="watermark"
      :style="[
        watermarkStyles,
        {
          width: `${watermarkSize}%`,
          maxWidth: '150px',
          opacity: 0.7
        }
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CameraProps, WatermarkPosition } from '../types';

type Props = Pick<CameraProps, 'showGrid' | 'gridType' | 'aspectRatio' | 'watermark' | 'watermarkAlt' | 'watermarkPosition' | 'watermarkSize'>;

const props = withDefaults(defineProps<Props>(), {
  showGrid: false,
  gridType: 'rule-of-thirds',
  aspectRatio: 'original',
  watermarkPosition: 'bottom-right',
  watermarkSize: 20
});

const watermarkStyles = computed(() => {
  const styles: Record<WatermarkPosition, Record<string, string>> = {
    'top-left': { top: '10px', left: '10px' },
    'top-right': { top: '10px', right: '10px' },
    'bottom-left': { bottom: '10px', left: '10px' },
    'bottom-right': { bottom: '10px', right: '10px' },
    'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
  };
  return styles[props.watermarkPosition || 'bottom-right'];
});
</script>

<style scoped>
.camera-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 2;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.watermark {
  position: absolute;
  z-index: 3;
  object-fit: contain;
  pointer-events: none;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* Grid types */
.rule-of-thirds {
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
  background-size: 33.33% 33.33%;
  background-position: -1px -1px;
}

.golden-ratio {
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
  background-size: 38.2% 38.2%;
  background-position: -1px -1px;
}

.center {
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
  background-size: 50% 50%;
  background-position: -1px -1px;
}

/* Aspect ratios */
.original {
  /* Default, no additional styles needed */
}

.aspect-16-9 {
  /* 16:9 aspect ratio styles if needed */
}

.aspect-4-3 {
  /* 4:3 aspect ratio styles if needed */
}

.aspect-1-1 {
  /* 1:1 aspect ratio styles if needed */
}

.aspect-3-2 {
  /* 3:2 aspect ratio styles if needed */
}
</style> 