<template>
  <div class="scoring-panel">
    <div class="category-tabs">
      <span v-for="cat in categories" :key="cat.key" class="category-tab" :class="{ active: currentCategory === cat.key }" @click="currentCategory = cat.key">
        {{ cat.icon }} {{ cat.name }}
      </span>
    </div>
    <div class="rules-list">
      <div v-for="rule in filteredRules" :key="rule.id" class="rule-item">
        <div class="rule-info">
          <span class="rule-icon">{{ rule.icon }}</span>
          <div class="rule-content">
            <p class="rule-title">{{ rule.title }}</p>
            <p class="rule-desc">{{ rule.description }}</p>
          </div>
        </div>
        <div class="rule-action">
          <span class="rule-points" :class="{ positive: rule.points > 0, negative: rule.points < 0 }">
            {{ rule.points > 0 ? '+' : '' }}{{ rule.points }}
          </span>
          <button class="btn-apply" :class="{ 'btn-minus': rule.points < 0 }" @click="$emit('apply', rule)">
            {{ rule.points > 0 ? '加分' : '扣分' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ rules: { type: Array, default: () => [] } })
defineEmits(['apply'])

const currentCategory = ref('学习')
const categories = [
  { key: '学习', name: '学习', icon: '📚' },
  { key: '行为', name: '行为', icon: '👤' },
  { key: '健康', name: '健康', icon: '💪' },
  { key: '其他', name: '其他', icon: '📌' },
  { key: '扣分', name: '扣分', icon: '⚠️' },
]
const filteredRules = computed(() => props.rules.filter(r => r.category === currentCategory.value))
</script>

<style scoped>
.scoring-panel { background: #fff; border-radius: 10px; overflow: hidden; }
.category-tabs { display: flex; border-bottom: 1px solid #f0f0f0; }
.category-tab {
  flex: 1; text-align: center; font-size: 13px;
  color: #999; padding: 12px 0; position: relative; cursor: pointer;
}
.category-tab.active { color: #ff6b35; font-weight: bold; }
.category-tab.active::after {
  content: ''; position: absolute; bottom: 0; left: 50%;
  transform: translateX(-50%); width: 30px; height: 3px;
  background: #ff6b35; border-radius: 2px;
}
.rules-list { padding: 10px; }
.rule-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 0; border-bottom: 1px solid #f5f5f5;
}
.rule-item:last-child { border-bottom: none; }
.rule-info { display: flex; align-items: center; flex: 1; }
.rule-icon { font-size: 22px; width: 36px; text-align: center; }
.rule-content { margin-left: 8px; }
.rule-title { font-size: 14px; color: #333; }
.rule-desc { font-size: 11px; color: #999; margin-top: 3px; }
.rule-action { display: flex; align-items: center; gap: 8px; }
.rule-points { font-size: 17px; font-weight: bold; min-width: 44px; text-align: right; }
.rule-points.positive { color: #52c41a; }
.rule-points.negative { color: #ff4d4f; }
.btn-apply {
  font-size: 12px; padding: 5px 12px;
  border-radius: 16px; background: #ff6b35;
  color: #fff; border: none; cursor: pointer;
}
.btn-apply.btn-minus { background: #ff4d4f; }
</style>
