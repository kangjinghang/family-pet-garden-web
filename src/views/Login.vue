<template>
  <div class="login-page">
    <div class="logo-section">
      <div class="logo">🐾</div>
      <h1 class="title">萌宠来啦</h1>
      <p class="subtitle">养宠养出好习惯</p>
    </div>
    <div class="features">
      <div class="feature-item"><span class="feature-icon">🥚</span><span class="feature-text">宠物孵化养成</span></div>
      <div class="feature-item"><span class="feature-icon">📝</span><span class="feature-text">双向积分评价</span></div>
      <div class="feature-item"><span class="feature-icon">🎁</span><span class="feature-text">积分兑换奖励</span></div>
    </div>
    <div class="login-section">
      <input class="nickname-input" placeholder="请输入昵称" v-model="nickName" />
      <button class="btn-start" @click="handleLogin">开始使用</button>
      <p class="login-hint">数据保存在浏览器本地</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/index.js'
import { showToast } from '@/utils/toast.js'

const router = useRouter()
const userStore = useUserStore()
const nickName = ref('')

const handleLogin = async () => {
  if (!nickName.value.trim()) { showToast('请输入昵称'); return }
  userStore.login(nickName.value.trim())
  showToast('登录成功')
  setTimeout(() => {
    router.push(userStore.familyId ? '/' : '/family?action=create')
  }, 800)
}
</script>

<style scoped>
.login-page { min-height: 100vh; background: linear-gradient(180deg, #fff5f0 0%, #fff 50%); display: flex; flex-direction: column; align-items: center; padding: 0 20px; }
.logo-section { margin-top: 80px; text-align: center; }
.logo { font-size: 80px; }
.title { font-size: 28px; font-weight: bold; color: #333; margin-top: 12px; }
.subtitle { font-size: 14px; color: #999; margin-top: 6px; }
.features { margin-top: 50px; width: 100%; }
.feature-item { display: flex; align-items: center; padding: 14px 0; border-bottom: 1px solid #f5f5f5; }
.feature-icon { font-size: 22px; width: 36px; text-align: center; }
.feature-text { font-size: 15px; color: #666; margin-left: 12px; }
.login-section { margin-top: 50px; width: 100%; }
.nickname-input { width: 100%; border: 1px solid #ddd; border-radius: 25px; padding: 12px 16px; font-size: 15px; margin-bottom: 16px; text-align: center; outline: none; }
.btn-start { width: 100%; padding: 14px; border-radius: 25px; border: none; font-size: 17px; color: #fff; background: linear-gradient(135deg, #ff6b35, #ff9a56); cursor: pointer; }
.login-hint { font-size: 12px; color: #ccc; text-align: center; margin-top: 12px; }
</style>
