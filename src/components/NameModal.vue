<template>
  <div v-if="visible" class="modal-mask" @click.stop="emit('cancel')">
    <div class="modal-box" @click.stop>
      <h3 class="modal-title">{{ title }}</h3>
      <p class="modal-content">{{ content }}</p>
      <input class="modal-input" :placeholder="placeholder" v-model="inputValue" autofocus />
      <div class="modal-btns">
        <button class="btn-cancel" @click="emit('cancel')">取消</button>
        <button class="btn-confirm" @click="emit('confirm', inputValue)">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  placeholder: { type: String, default: '请输入' },
  defaultValue: { type: String, default: '' },
})
const emit = defineEmits(['confirm', 'cancel'])
const inputValue = ref('')
watch(() => props.visible, (val) => { if (val) inputValue.value = props.defaultValue })
</script>

<style scoped>
.modal-mask {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,.5); display: flex;
  align-items: center; justify-content: center; z-index: 9999;
}
.modal-box { width: 320px; background: #fff; border-radius: 14px; padding: 20px; }
.modal-title { font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 8px; }
.modal-content { font-size: 14px; color: #666; text-align: center; margin-bottom: 16px; }
.modal-input {
  width: 100%; border: 1px solid #ddd; border-radius: 8px;
  padding: 10px; font-size: 14px; margin-bottom: 16px; outline: none;
}
.modal-btns { display: flex; gap: 12px; }
.btn-cancel, .btn-confirm {
  flex: 1; text-align: center; padding: 10px 0;
  border-radius: 8px; font-size: 15px; border: none; cursor: pointer;
}
.btn-cancel { background: #f5f5f5; color: #666; }
.btn-confirm { background: linear-gradient(135deg, #ff6b35, #ff9a56); color: #fff; }
</style>
