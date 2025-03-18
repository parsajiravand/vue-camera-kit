<template>
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="vue-camera-logo"
  >
    <!-- Camera Body -->
    <rect
      x="4"
      y="12"
      width="40"
      height="28"
      rx="4"
      fill="#41B883"
      class="camera-body"
    />
    
    <!-- Camera Top -->
    <path
      d="M16 12L20 6H28L32 12"
      fill="#34495E"
      class="camera-top"
    />
    
    <!-- Lens Circle -->
    <circle
      cx="24"
      cy="26"
      r="10"
      fill="#34495E"
      class="lens-outer"
    />
    <circle
      cx="24"
      cy="26"
      r="7"
      fill="#41B883"
      class="lens-inner"
    />
    
    <!-- Flash -->
    <rect
      x="32"
      y="16"
      width="6"
      height="3"
      rx="1.5"
      fill="#34495E"
      class="flash"
    />
  </svg>
</template>

<style scoped>
.vue-camera-logo {
  transition: all 0.3s ease;
}

.vue-camera-logo:hover {
  transform: scale(1.05);
}

.camera-body {
  transition: fill 0.3s ease;
}

.vue-camera-logo:hover .camera-body {
  fill: #3aa876;
}

.lens-inner {
  transition: fill 0.3s ease;
}

.vue-camera-logo:hover .lens-inner {
  fill: #3aa876;
}
</style> 