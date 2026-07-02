<template>
  <div class="score-bar">
    <div class="score-item">
      <span class="score-icon">⭐</span>
      <span class="score-value">{{ points }}</span>
      <span class="score-label">积分</span>
    </div>
    <div class="score-item">
      <span class="score-icon">🏆</span>
      <span class="score-value">{{ completedToday }}</span>
      <span class="score-label">今日完成</span>
    </div>
    <div class="score-item">
      <span class="score-icon">🔥</span>
      <span class="score-value">{{ streak }}</span>
      <span class="score-label">连续天数</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  points: { type: Number, default: 0 },
  completedToday: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
})
</script>

<style scoped>
.score-bar {
  display: flex; justify-content: space-around;
  background: #fff; border-radius: 10px; padding: 14px; margin: 10px;
}
.score-item { text-align: center; }
.score-icon { font-size: 22px; }
.score-value { display: block; font-size: 20px; font-weight: bold; color: #333; margin: 4px 0; }
.score-label { font-size: 11px; color: #999; }
</style>
