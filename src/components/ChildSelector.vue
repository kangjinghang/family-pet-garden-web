<template>
  <div class="child-selector">
    <div class="child-list">
      <div v-for="child in children" :key="child.id" class="child-item" :class="{ active: child.id === selectedId }" @click="$emit('select', child.id)">
        <div class="child-avatar"><span class="avatar-text">{{ child.name[0] }}</span></div>
        <span class="child-name">{{ child.name }}</span>
        <div v-if="child.id === selectedId" class="active-line"></div>
      </div>
      <div class="child-item add-item" @click="$emit('add')">
        <div class="child-avatar add-avatar"><span class="add-icon">+</span></div>
        <span class="child-name">添加孩子</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  children: { type: Array, default: () => [] },
  selectedId: { type: String, default: '' },
})
defineEmits(['select', 'add'])
</script>

<style scoped>
.child-selector { background: #fff; padding: 12px 0; }
.child-list { display: flex; overflow-x: auto; padding: 0 12px; gap: 16px; }
.child-item { display: flex; flex-direction: column; align-items: center; position: relative; flex-shrink: 0; }
.child-avatar {
  width: 44px; height: 44px; border-radius: 50%;
  background: #f0f0f0; display: flex;
  align-items: center; justify-content: center; overflow: hidden;
}
.avatar-text { font-size: 17px; color: #666; font-weight: bold; }
.child-name { font-size: 11px; color: #666; margin-top: 4px; }
.child-item.active .child-name { color: #ff6b35; font-weight: bold; }
.active-line {
  position: absolute; bottom: -4px; width: 22px; height: 2px;
  background: #ff6b35; border-radius: 1px;
}
.add-avatar { border: 1px dashed #ccc; background: transparent; }
.add-icon { font-size: 22px; color: #ccc; }
</style>
