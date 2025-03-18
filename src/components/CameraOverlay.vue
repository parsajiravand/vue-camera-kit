<template>
  <div class="camera-overlay" :style="overlayStyles">
    <!-- Grid Lines -->
    <div v-if="showGrid" class="grid-lines" :class="gridType">
      <div v-for="i in 2" :key="`v-${i}`" class="vertical-line"></div>
      <div v-for="i in 2" :key="`h-${i}`" class="horizontal-line"></div>
    </div>

    <!-- Aspect Ratio Mask -->
    <div v-if="aspectRatio !== 'original'" class="aspect-ratio-mask" :class="aspectRatio"></div>

    <!-- Watermark -->
    <div v-if="watermark" class="watermark" :style="watermarkStyles">
      <img :src="watermark" :alt="watermarkAlt" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { GridType, AspectRatio, WatermarkPosition } from '../types';

interface Props {
  showGrid?: boolean;
  gridType?: GridType;
  aspectRatio?: AspectRatio;
  watermark?: string;
  watermarkAlt?: string;
  watermarkPosition?: WatermarkPosition;
  watermarkSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  showGrid: false,
  gridType: 'rule-of-thirds',
  aspectRatio: 'original',
  watermarkPosition: 'bottom-right',
  watermarkSize: 20
});

const overlayStyles = computed(() => ({}));

type PositionStyles = {
  [key in WatermarkPosition]: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    transform?: string;
  }
};

const positions: PositionStyles = {
  'top-left': { top: '10px', left: '10px' },
  'top-right': { top: '10px', right: '10px' },
  'bottom-left': { bottom: '10px', left: '10px' },
  'bottom-right': { bottom: '10px', right: '10px' },
  'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
};

const watermarkStyles = computed(() => {
  return {
    ...positions[props.watermarkPosition],
    maxWidth: `${props.watermarkSize}%`,
    maxHeight: `${props.watermarkSize}%`
  };
});
</script>

<style scoped>
.camera-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* Grid Lines */
.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.vertical-line,
.horizontal-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.5);
}

.vertical-line {
  width: 1px;
  height: 100%;
}

.horizontal-line {
  width: 100%;
  height: 1px;
}

/* Rule of Thirds Grid */
.rule-of-thirds .vertical-line:nth-child(1) { left: 33.33%; }
.rule-of-thirds .vertical-line:nth-child(2) { left: 66.66%; }
.rule-of-thirds .horizontal-line:nth-child(3) { top: 33.33%; }
.rule-of-thirds .horizontal-line:nth-child(4) { top: 66.66%; }

/* Golden Ratio Grid */
.golden-ratio .vertical-line:nth-child(1) { left: 38.2%; }
.golden-ratio .vertical-line:nth-child(2) { left: 61.8%; }
.golden-ratio .horizontal-line:nth-child(3) { top: 38.2%; }
.golden-ratio .horizontal-line:nth-child(4) { top: 61.8%; }

/* Center Grid */
.center .vertical-line:nth-child(1) { left: 50%; }
.center .vertical-line:nth-child(2) { display: none; }
.center .horizontal-line:nth-child(3) { top: 50%; }
.center .horizontal-line:nth-child(4) { display: none; }

/* Aspect Ratio Masks */
.aspect-ratio-mask {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.aspect-ratio-mask[class="1:1"] {
  width: 100%;
  padding-bottom: 100%;
}

.aspect-ratio-mask[class="16:9"] {
  width: 100%;
  padding-bottom: 56.25%;
}

.aspect-ratio-mask[class="4:3"] {
  width: 100%;
  padding-bottom: 75%;
}

.aspect-ratio-mask[class="3:2"] {
  width: 100%;
  padding-bottom: 66.67%;
}

/* Watermark */
.watermark {
  position: absolute;
  z-index: 10;
}

.watermark img {
  max-width: 100%;
  height: auto;
  opacity: 0.8;
}
</style> 