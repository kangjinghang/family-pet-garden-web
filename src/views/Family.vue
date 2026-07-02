<template>
  <div class="family-page">
    <div v-if="action === 'create' && !created" class="form-section">
      <h2 class="form-title">创建家庭</h2>
      <div class="form-item">
        <label class="form-label">家庭名称</label>
        <input class="form-input" v-model="familyName" placeholder="如：快乐一家人" maxlength="12" />
      </div>
      <div class="form-item">
        <label class="form-label">孩子昵称</label>
        <input class="form-input" v-model="childName" placeholder="如：大宝" maxlength="8" />
      </div>
      <PetSelector v-model="selectedPetType" />
      <button class="btn-primary" @click="handleCreate">创建家庭</button>
    </div>

    <div v-if="action === 'join'" class="form-section">
      <h2 class="form-title">加入家庭</h2>
      <p class="join-tip">本地模式不支持加入家庭，请创建新家庭</p>
      <button class="btn-primary" @click="action = 'create'">去创建</button>
    </div>

    <div v-if="created" class="success-section">
      <div class="success-icon">🎉</div>
      <h2 class="success-title">家庭创建成功！</h2>
      <p class="success-hint">邀请家人一起加入吧</p>
      <div class="code-box">
        <p class="code-label">邀请码</p>
        <p class="code-value">{{ createdInviteCode }}</p>
        <button class="btn-copy" @click="copyCode">复制邀请码</button>
      </div>
      <button class="btn-primary" @click="router.push('/')">返回首页</button>
    </div>

    <div v-if="action === 'info' && familyStore.familyId" class="info-section">
      <div class="info-card">
        <p class="info-label">家庭名称</p>
        <p class="info-value">{{ familyStore.familyName }}</p>
      </div>
      <div class="info-card">
        <p class="info-label">邀请码</p>
        <p class="info-code">{{ familyStore.inviteCode }}</p>
        <button class="btn-copy" @click="copyCode">复制邀请码</button>
      </div>
      <div class="info-card">
        <p class="info-label">孩子（{{ familyStore.children.length }}人）</p>
        <div v-for="child in familyStore.children" :key="child.id" class="member-item">
          <span class="member-icon">👶</span>
          <span class="member-name">{{ child.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore, useFamilyStore } from '@/stores/index.js'
import { showToast } from '@/utils/toast.js'
import PetSelector from '@/components/PetSelector.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const familyStore = useFamilyStore()

const action = ref('create')
const familyName = ref('')
const childName = ref('')
const selectedPetType = ref('cat')
const created = ref(false)
const createdInviteCode = ref('')

onMounted(() => {
  if (route.query.action) action.value = route.query.action
})

const handleCreate = async () => {
  if (!familyName.value.trim()) { showToast('请输入家庭名称'); return }
  if (!childName.value.trim()) { showToast('请输入孩子昵称'); return }
  const res = familyStore.createFamily(familyName.value.trim(), childName.value.trim(), selectedPetType.value)
  if (res.ok) {
    userStore.setFamilyId(res.familyId)
    created.value = true
    createdInviteCode.value = res.inviteCode
  } else {
    showToast(res.msg || '创建失败')
  }
}

const copyCode = () => {
  navigator.clipboard?.writeText(createdInviteCode.value || familyStore.inviteCode)
  showToast('已复制')
}
</script>

<style scoped>
.family-page { min-height: 100vh; background: #f5f5f5; padding: 20px; }
.form-section { background: #fff; border-radius: 12px; padding: 20px; }
.form-title { font-size: 20px; font-weight: bold; color: #333; margin-bottom: 20px; }
.form-item { margin-bottom: 16px; }
.form-label { font-size: 14px; color: #666; display: block; margin-bottom: 8px; }
.form-input { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 12px; font-size: 14px; }
.join-tip { font-size: 14px; color: #999; margin-bottom: 16px; }
.btn-primary { width: 100%; background: linear-gradient(135deg, #ff6b35, #ff9a56); color: #fff; border: none; border-radius: 25px; font-size: 15px; margin-top: 16px; padding: 12px; cursor: pointer; }
.success-section { text-align: center; padding: 30px 0; }
.success-icon { font-size: 50px; }
.success-title { font-size: 20px; font-weight: bold; color: #333; margin-top: 16px; }
.success-hint { font-size: 13px; color: #999; margin-top: 6px; }
.code-box { background: #fff; border-radius: 12px; padding: 20px; margin: 20px 0; }
.code-label { font-size: 13px; color: #999; }
.code-value { font-size: 36px; font-weight: bold; color: #ff6b35; letter-spacing: 6px; margin: 10px 0; }
.btn-copy { background: #f5f5f5; color: #666; border: none; border-radius: 25px; font-size: 14px; padding: 8px 16px; cursor: pointer; }
.info-section {}
.info-card { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
.info-label { font-size: 12px; color: #999; margin-bottom: 8px; }
.info-value { font-size: 17px; font-weight: bold; color: #333; }
.info-code { font-size: 32px; font-weight: bold; color: #ff6b35; text-align: center; letter-spacing: 6px; margin: 8px 0; }
.member-item { display: flex; align-items: center; padding: 6px 0; }
.member-icon { font-size: 16px; margin-right: 8px; }
.member-name { font-size: 14px; color: #333; }
</style>
