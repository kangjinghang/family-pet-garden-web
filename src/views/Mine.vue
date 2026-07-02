<template>
  <div class="mine-page">
    <div class="profile-card" @click="!userStore.nickName && router.push('/login')">
      <div class="avatar-placeholder">{{ userStore.nickName ? userStore.nickName[0] : '?' }}</div>
      <div class="profile-info">
        <p class="nickname">{{ userStore.nickName || '未登录' }}</p>
        <p class="family-name" v-if="familyStore.familyName">{{ familyStore.familyName }}</p>
        <p class="login-tip" v-else-if="!userStore.nickName">点击登录</p>
      </div>
    </div>
    <div v-if="familyStore.familyId" class="section">
      <p class="section-title">家庭成员</p>
      <div v-for="member in familyStore.members" :key="member" class="member-item">
        <div class="member-avatar">👤</div>
        <span class="member-name">{{ member === userStore.openid ? (userStore.nickName || '我') : '家庭成员' }}</span>
      </div>
    </div>
    <div class="menu-list">
      <div class="menu-item" @click="familyStore.familyId ? router.push('/family?action=info') : router.push('/family?action=create')">
        <span class="menu-icon">👨‍👩‍👧‍👦</span><span class="menu-text">家庭设置</span><span class="menu-arrow">›</span>
      </div>
      <div class="menu-item" @click="router.push('/rules')">
        <span class="menu-icon">📋</span><span class="menu-text">自定义规则</span><span class="menu-arrow">›</span>
      </div>
      <div class="menu-item" @click="showToast('功能开发中')">
        <span class="menu-icon">📊</span><span class="menu-text">成长记录</span><span class="menu-arrow">›</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore, useFamilyStore } from '@/stores/index.js'
import { useRouter } from 'vue-router'
import { showToast } from '@/utils/toast.js'

const router = useRouter()
const userStore = useUserStore()
const familyStore = useFamilyStore()
</script>

<style scoped>
.mine-page { min-height: 100vh; background: #f5f5f5; padding-bottom: 80px; }
.profile-card { display: flex; align-items: center; background: #fff; padding: 20px; margin-bottom: 10px; cursor: pointer; }
.avatar-placeholder { width: 60px; height: 60px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #666; }
.profile-info { margin-left: 16px; }
.nickname { font-size: 17px; font-weight: bold; color: #333; }
.family-name { font-size: 12px; color: #ff6b35; margin-top: 4px; }
.login-tip { font-size: 12px; color: #999; margin-top: 4px; }
.section { background: #fff; padding: 16px 20px; margin-bottom: 10px; }
.section-title { font-size: 14px; color: #999; margin-bottom: 10px; }
.member-item { display: flex; align-items: center; padding: 8px 0; }
.member-avatar { width: 32px; height: 32px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.member-name { font-size: 14px; color: #333; margin-left: 10px; }
.menu-list { background: #fff; }
.menu-item { display: flex; align-items: center; padding: 16px 20px; border-bottom: 1px solid #f5f5f5; cursor: pointer; }
.menu-icon { font-size: 22px; width: 36px; }
.menu-text { flex: 1; font-size: 14px; color: #333; margin-left: 10px; }
.menu-arrow { font-size: 18px; color: #ccc; }
</style>
