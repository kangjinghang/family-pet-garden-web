<template>
  <div class="badge-wall">
    <h3 class="wall-title">🏆 荣誉徽章</h3>
    <p v-if="badges.length > 0" class="wall-count">已获得 {{ badges.length }} 枚徽章</p>
    <div v-if="badges.length === 0" class="empty-state">
      <div class="empty-emoji">🎯</div>
      <p class="empty-text">还没有徽章</p>
      <p class="empty-hint">宠物满级毕业即可获得徽章</p>
    </div>
    <div v-else class="badge-grid">
      <div v-for="badge in badges" :key="badge.id" class="badge-item">
        <span class="badge-emoji">{{ getPetEmoji(badge.petType) }}</span>
        <span class="badge-pet-name">{{ badge.petName }}</span>
        <span class="badge-child">{{ badge.childName }}的宠物</span>
        <span class="badge-date">{{ formatDate(badge.graduatedAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getPetById } from '@/data/pets.js'

defineProps({ badges: { type: Array, default: () => [] } })

const getPetEmoji = (petType) => { const pet = getPetById(petType); return pet ? pet.emoji : '🐱' }
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}
</script>

<style scoped>
.badge-wall {
  background: #fff; border-radius: 12px; padding: 16px; margin: 10px;
}
.wall-title { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 4px; }
.wall-count { font-size: 12px; color: #999; margin-bottom: 12px; }
.empty-state { text-align: center; padding: 20px 0; }
.empty-emoji { font-size: 36px; margin-bottom: 8px; }
.empty-text { font-size: 14px; color: #999; }
.empty-hint { font-size: 11px; color: #ccc; margin-top: 4px; }
.badge-grid { display: flex; flex-wrap: wrap; gap: 10px; }
.badge-item {
  width: calc(33.33% - 7px); display: flex; flex-direction: column;
  align-items: center; padding: 12px 6px;
  background: linear-gradient(135deg, #fff9e6, #fff3cc);
  border-radius: 10px; border: 1px solid #ffe58f;
}
.badge-emoji { font-size: 28px; margin-bottom: 4px; }
.badge-pet-name { font-size: 12px; font-weight: bold; color: #333; }
.badge-child { font-size: 10px; color: #999; margin-top: 2px; }
.badge-date { font-size: 9px; color: #ccc; margin-top: 2px; }
</style>
