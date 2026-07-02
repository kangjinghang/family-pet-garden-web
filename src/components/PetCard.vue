<template>
  <div class="pet-card">
    <!-- 蛋阶段 -->
    <div v-if="petStage === 'egg'" class="egg-container">
      <div class="egg" :class="{ shaking: isShaking }">🥚</div>
      <p v-if="!canHatch" class="egg-hint">还需要 {{ hatchNeeded - petExp }} 经验孵化</p>
      <button v-else class="btn-hatch" @click="handleHatch">孵化宠物！</button>
      <div class="exp-bar"><div class="exp-fill" :style="{ width: hatchPercent + '%' }"></div></div>
    </div>

    <!-- 宠物阶段 -->
    <div v-else class="pet-container">
      <div class="pet-info">
        <span class="pet-emoji" :class="{ 'pet-bounce': celebrate }">{{ petImage }}</span>
        <div class="pet-details">
          <p class="pet-name">{{ petName }}</p>
          <div class="pet-tags">
            <span class="pet-level">Lv.{{ petLevel }}</span>
            <span class="pet-stage">{{ stageText }}</span>
          </div>
          <div class="exp-bar"><div class="exp-fill" :style="{ width: expPercent + '%' }"></div></div>
        </div>
      </div>
      <div class="pet-actions"><button class="btn-switch" @click="showSwitchModal = true">换宠物</button></div>
      <p class="status-text">{{ statusText }}</p>
      <div v-if="celebrate" class="celebrate-bar"><p class="celebrate-text">{{ celebrateText }}</p></div>
    </div>

    <!-- 切换宠物弹窗 -->
    <div v-if="showSwitchModal" class="modal-mask" @click.stop="showSwitchModal = false">
      <div class="modal-box" @click.stop>
        <h3 class="modal-title">换个宠物</h3>
        <p class="modal-hint">{{ petStage === 'egg' ? '蛋阶段可以免费换宠物' : '当前进度将重置，确定要换吗？' }}</p>
        <PetSelector v-model="switchPetType" />
        <div class="modal-btns">
          <button class="btn-cancel" @click="showSwitchModal = false">取消</button>
          <button class="btn-confirm" @click="confirmSwitch">确定换</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { getPetById } from '@/data/pets.js'
import PetSelector from './PetSelector.vue'

const props = defineProps({
  petStage: { type: String, default: 'egg' },
  petLevel: { type: Number, default: 1 },
  petExp: { type: Number, default: 0 },
  petName: { type: String, default: '小萌宠' },
  petType: { type: String, default: 'cat' },
  hatchNeeded: { type: Number, default: 20 },
  celebrate: { type: Boolean, default: false },
})

const emit = defineEmits(['hatch', 'switchPet'])
const isShaking = ref(false)
const showSwitchModal = ref(false)
const switchPetType = ref(props.petType)

const hatchPercent = computed(() => Math.min((props.petExp / props.hatchNeeded) * 100, 100))
const canHatch = computed(() => props.petExp >= props.hatchNeeded)
const petImage = computed(() => { const pet = getPetById(props.petType); return pet ? pet.emoji : '🐱' })
const stageText = computed(() => ({ baby: '幼崽', child: '成长', teen: '少年', adult: '成年' })[props.petStage] || '幼崽')
const expPercent = computed(() => Math.min((props.petExp / (props.petLevel * 100)) * 100, 100))
const statusText = computed(() => {
  if (props.petStage === 'adult') return '已成年！继续陪伴成长'
  if (props.petStage === 'teen') return '即将成年，继续加油'
  if (props.petStage === 'child') return '正在成长中...'
  return '幼崽需要你的关爱'
})
const celebrateText = computed(() => {
  if (props.petLevel >= 10) return `🏆 ${props.petName}成年了！好习惯已经长在身上了！`
  if (props.petLevel >= 6) return `🌟 ${props.petName}长大了一点！`
  return `🎉 ${props.petName}学会了新本领！`
})

const confirmSwitch = () => { showSwitchModal.value = false; emit('switchPet', switchPetType.value) }
const handleHatch = () => { isShaking.value = true; setTimeout(() => { isShaking.value = false; emit('hatch') }, 1000) }
</script>

<style scoped>
.pet-card {
  background: linear-gradient(135deg, #fff5f0, #fff);
  border-radius: 12px; padding: 16px; margin: 10px;
}
.egg-container { text-align: center; padding: 10px 0; }
.egg { font-size: 64px; display: inline-block; animation: float 2s ease-in-out infinite; }
.egg.shaking { animation: shake .5s ease-in-out; }
.egg-hint { font-size: 12px; color: #999; margin: 10px 0; }
.btn-hatch {
  background: linear-gradient(135deg, #ff6b35, #ff9a56);
  color: #fff; border: none; border-radius: 25px;
  font-size: 17px; padding: 10px 30px; margin: 10px 0;
  box-shadow: 0 4px 12px rgba(255,107,53,.4); cursor: pointer;
}
.pet-container {}
.pet-info { display: flex; align-items: center; }
.pet-emoji { font-size: 64px; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; }
.pet-details { margin-left: 16px; }
.pet-name { font-size: 20px; font-weight: bold; color: #333; }
.pet-tags { display: flex; align-items: center; margin-top: 4px; }
.pet-level {
  font-size: 12px; color: #ff6b35; background: #fff5f0;
  padding: 2px 8px; border-radius: 10px;
}
.pet-stage { font-size: 11px; color: #999; margin-left: 6px; }
.pet-actions { margin-top: 8px; text-align: right; }
.btn-switch {
  font-size: 12px; color: #999;
  background: none; border: none; cursor: pointer; padding: 4px 8px;
}
.btn-switch:hover { color: #ff6b35; }
.status-text { margin-top: 10px; text-align: center; font-size: 12px; color: #999; }
.celebrate-bar { margin-top: 10px; text-align: center; animation: fadeInUp .3s ease-out; }
.celebrate-text { font-size: 14px; color: #ff6b35; font-weight: bold; }
.pet-bounce { animation: bounce .6s ease-out; }

.exp-bar {
  width: 150px; height: 8px; background: #eee;
  border-radius: 4px; margin-top: 8px;
}
.exp-fill {
  height: 100%; background: linear-gradient(90deg, #ff6b35, #ff9a56);
  border-radius: 4px; transition: width .3s;
}

.modal-mask {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,.5); display: flex;
  align-items: center; justify-content: center; z-index: 9999;
}
.modal-box {
  width: 340px; max-height: 80vh; background: #fff;
  border-radius: 14px; padding: 20px; overflow-y: auto;
}
.modal-title { font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 5px; }
.modal-hint { font-size: 12px; color: #999; text-align: center; margin-bottom: 12px; }
.modal-btns { display: flex; gap: 12px; margin-top: 16px; }
.btn-cancel, .btn-confirm {
  flex: 1; text-align: center; padding: 10px 0;
  border-radius: 8px; font-size: 15px; border: none; cursor: pointer;
}
.btn-cancel { background: #f5f5f5; color: #666; }
.btn-confirm { background: linear-gradient(135deg, #ff6b35, #ff9a56); color: #fff; }

@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes shake { 0%,100% { transform: rotate(0); } 25% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } 75% { transform: rotate(-10deg); } }
@keyframes bounce { 0% { transform: scale(1); } 30% { transform: scale(1.2); } 60% { transform: scale(.95); } 100% { transform: scale(1); } }
@keyframes fadeInUp { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }
</style>
