<template>
  <div id="app-root">
    <router-view />
    <nav v-if="showTabBar" class="tab-bar">
      <router-link to="/" class="tab-item" :class="{ active: $route.path === '/' }">
        <span class="tab-icon">🏠</span>
        <span class="tab-text">首页</span>
      </router-link>
      <router-link to="/store" class="tab-item" :class="{ active: $route.path === '/store' }">
        <span class="tab-icon">🎁</span>
        <span class="tab-text">商店</span>
      </router-link>
      <router-link to="/mine" class="tab-item" :class="{ active: $route.path === '/mine' }">
        <span class="tab-icon">👤</span>
        <span class="tab-text">我的</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const tabPaths = ['/', '/store', '/mine']
const showTabBar = computed(() => tabPaths.includes(route.path))
</script>

<style scoped>
#app-root {
  max-width: 750px;
  margin: 0 auto;
  min-height: 100vh;
  background: #f5f5f5;
}
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 750px;
  display: flex;
  justify-content: space-around;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  padding: 8px 0;
  padding-bottom: env(safe-area-inset-bottom, 8px);
  z-index: 100;
}
.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #999;
  font-size: 11px;
  padding: 4px 12px;
}
.tab-item.active {
  color: #ff6b35;
}
.tab-icon {
  font-size: 22px;
  margin-bottom: 2px;
}
.tab-text {
  font-size: 11px;
}
</style>
