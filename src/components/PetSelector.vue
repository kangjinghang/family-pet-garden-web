<template>
  <div class="pet-selector">
    <p class="selector-title">选择宠物</p>
    <div class="category-tabs">
      <span v-for="cat in categories" :key="cat.key" class="category-tab" :class="{ active: currentCategory === cat.key }" @click="currentCategory = cat.key">
        {{ cat.icon }} {{ cat.name }}
      </span>
    </div>
    <div class="pet-grid">
      <div v-for="pet in filteredPets" :key="pet.id" class="pet-item" :class="{ selected: selectedPetId === pet.id }" @click="selectPet(pet)">
        <span class="pet-emoji">{{ pet.emoji }}</span>
        <span class="pet-name">{{ pet.name }}</span>
      </div>
    </div>
    <div v-if="selectedPet" class="pet-preview">
      <span class="preview-emoji">{{ selectedPet.emoji }}</span>
      <div class="preview-info">
        <p class="preview-name">{{ selectedPet.name }}</p>
        <p class="preview-desc">{{ selectedPet.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PET_CATEGORIES, PETS } from '@/data/pets.js'

const props = defineProps({ modelValue: { type: String, default: '' } })
const emit = defineEmits(['update:modelValue'])

const categories = PET_CATEGORIES
const currentCategory = ref('cute')
const selectedPetId = ref(props.modelValue || 'cat')
const filteredPets = computed(() => PETS.filter(p => p.category === currentCategory.value))
const selectedPet = computed(() => PETS.find(p => p.id === selectedPetId.value))

const selectPet = (pet) => { selectedPetId.value = pet.id; emit('update:modelValue', pet.id) }
</script>

<style scoped>
.pet-selector { padding: 10px; }
.selector-title { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 10px; }
.category-tabs { display: flex; gap: 8px; margin-bottom: 12px; overflow-x: auto; }
.category-tab {
  display: inline-flex; align-items: center; padding: 6px 12px;
  border-radius: 16px; background: #f5f5f5; font-size: 12px;
  color: #666; cursor: pointer; flex-shrink: 0;
}
.category-tab.active { background: #fff5f0; border: 1px solid #ff6b35; color: #ff6b35; font-weight: bold; }
.pet-grid { display: flex; flex-wrap: wrap; gap: 10px; }
.pet-item {
  width: calc(25% - 8px); display: flex; flex-direction: column;
  align-items: center; padding: 10px 0; border-radius: 10px;
  background: #f9f9f9; border: 2px solid transparent; cursor: pointer;
}
.pet-item.selected { background: #fff5f0; border-color: #ff6b35; }
.pet-emoji { font-size: 28px; margin-bottom: 4px; }
.pet-name { font-size: 11px; color: #666; }
.pet-item.selected .pet-name { color: #ff6b35; font-weight: bold; }
.pet-preview {
  display: flex; align-items: center; margin-top: 12px;
  padding: 12px; background: #fff5f0; border-radius: 10px;
}
.preview-emoji { font-size: 36px; margin-right: 12px; }
.preview-info { flex: 1; }
.preview-name { font-size: 16px; font-weight: bold; color: #333; }
.preview-desc { font-size: 12px; color: #999; margin-top: 3px; }
</style>
