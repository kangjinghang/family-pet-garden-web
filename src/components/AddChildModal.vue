<template>
  <div v-if="visible" class="modal-mask" @click.stop="emit('cancel')">
    <div class="modal-box" @click.stop>
      <h3 class="modal-title">{{ title }}</h3>
      <div class="form-item">
        <label class="form-label">孩子昵称</label>
        <input class="form-input" :placeholder="placeholder" v-model="childName" maxlength="8" />
      </div>
      <div class="pet-quick-select">
        <label class="form-label">选择宠物</label>
        <div class="pet-scroll">
          <div v-for="pet in quickPets" :key="pet.id" class="pet-quick-item" :class="{ selected: selectedPetType === pet.id }" @click="selectedPetType = pet.id">
            <span class="pet-emoji">{{ pet.emoji }}</span>
            <span class="pet-name">{{ pet.name }}</span>
          </div>
        </div>
      </div>
      <div class="modal-btns">
        <button class="btn-cancel" @click="emit('cancel')">取消</button>
        <button class="btn-confirm" @click="emit('confirm', { name: childName, petType: selectedPetType })">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { PETS } from '@/data/pets.js'

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '' },
  placeholder: { type: String, default: '请输入' },
})
const emit = defineEmits(['confirm', 'cancel'])
const childName = ref('')
const selectedPetType = ref('cat')
const quickPets = PETS.slice(0, 12)

watch(() => props.visible, (val) => { if (val) { childName.value = ''; selectedPetType.value = 'cat' } })
</script>

<style scoped>
.modal-mask {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,.5); display: flex;
  align-items: center; justify-content: center; z-index: 9999;
}
.modal-box {
  width: 360px; max-height: 80vh; background: #fff;
  border-radius: 14px; padding: 20px; overflow-y: auto;
}
.modal-title { font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 16px; }
.form-item { margin-bottom: 12px; }
.form-label { font-size: 13px; color: #666; display: block; margin-bottom: 6px; }
.form-input {
  width: 100%; border: 1px solid #ddd; border-radius: 8px;
  padding: 10px; font-size: 14px;
}
.pet-quick-select { margin-bottom: 12px; }
.pet-scroll { display: flex; gap: 8px; margin-top: 6px; overflow-x: auto; }
.pet-quick-item {
  display: flex; flex-direction: column; align-items: center;
  padding: 8px 10px; border-radius: 8px; background: #f9f9f9;
  border: 2px solid transparent; cursor: pointer; flex-shrink: 0;
}
.pet-quick-item.selected { background: #fff5f0; border-color: #ff6b35; }
.pet-quick-item .pet-emoji { font-size: 22px; }
.pet-quick-item .pet-name { font-size: 10px; color: #666; margin-top: 2px; }
.pet-quick-item.selected .pet-name { color: #ff6b35; }
.modal-btns { display: flex; gap: 12px; margin-top: 16px; }
.btn-cancel, .btn-confirm {
  flex: 1; text-align: center; padding: 10px 0;
  border-radius: 8px; font-size: 15px; border: none; cursor: pointer;
}
.btn-cancel { background: #f5f5f5; color: #666; }
.btn-confirm { background: linear-gradient(135deg, #ff6b35, #ff9a56); color: #fff; }
</style>
