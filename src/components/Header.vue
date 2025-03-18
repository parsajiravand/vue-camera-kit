<template>
  <header class="header">
    <div class="header-content">
      <Logo class="header-logo" />
      <h1>Vue Camera Kit</h1>
    </div>
    <div class="package-links">
      <a href="https://www.npmjs.com/package/vue-camera-kit" target="_blank" rel="noopener noreferrer" class="package-link">
        <img src="https://badge.fury.io/js/vue-camera-kit.svg" alt="npm version" />
        NPM Package
      </a>
      <a href="https://github.com/your-username/vue-camera-kit" target="_blank" rel="noopener noreferrer" class="package-link">
        <img src="https://img.shields.io/github/license/your-username/vue-camera-kit" alt="GitHub" />
        GitHub Repository
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
import Logo from './Logo.vue';
</script>

<style scoped>
.header {
  padding: 20px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}

.header-logo {
  width: 48px;
  height: 48px;
}

h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 2.5rem;
}

.package-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.package-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  text-decoration: none;
  color: #2c3e50;
  transition: all 0.3s ease;
}

.package-link:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.package-link img {
  height: 20px;
}
</style> 