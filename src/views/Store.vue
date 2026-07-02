<template>
  <div class="store-page">
    <div v-if="familyStore.children.length > 1" class="child-select">
      <span class="select-label">兑换给：</span>
      <select class="child-select-input" v-model="selectedChildIndex">
        <option v-for="(child, i) in familyStore.children" :key="child.id" :value="i">{{ child.name }}</option>
      </select>
    </div>
    <div class="balance-card">
      <p class="balance-label">可用积分</p>
      <p class="balance-value">{{ familyStore.points }}</p>
      <p class="balance-hint">家庭共享积分，所有人评分会增加</p>
    </div>
    <div class="section">
      <div class="section-header"><h3 class="section-title">商品列表</h3></div>
      <div class="goods-list">
        <div v-for="item in familyStore.storeItems" :key="item._id" class="goods-item" :class="{ 'out-of-stock': item.stock <= 0 }">
          <span class="goods-icon">{{ item.icon }}</span>
          <div class="goods-info">
            <p class="goods-name">{{ item.title }}</p>
            <p class="goods-desc">{{ item.description }}</p>
            <p class="goods-stock">库存: {{ item.stock }}</p>
          </div>
          <div class="goods-action">
            <p class="goods-cost">{{ item.cost }}</p>
            <button class="btn-buy" :disabled="familyStore.points < item.cost || item.stock <= 0" @click="handleBuy(item)">
              {{ familyStore.points >= item.cost ? '兑换' : '还差' + (item.cost - familyStore.points) + '分' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-header"><h3 class="section-title">兑换记录</h3></div>
      <div class="record-list">
        <div v-for="record in familyStore.redeemHistory" :key="record.id" class="record-item">
          <div class="record-info"><span class="record-icon">{{ record.icon }}</span><span class="record-name">{{ record.title }}</span></div>
          <div class="record-action"><p class="record-cost">-{{ record.cost }}</p><p class="record-time">{{ record.time }}</p></div>
        </div>
        <div v-if="familyStore.redeemHistory.length === 0" class="empty-record"><p class="empty-text">暂无兑换记录</p></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFamilyStore } from '@/stores/index.js'
import { showToast, showModal } from '@/utils/toast.js'

const familyStore = useFamilyStore()
const selectedChildIndex = ref(0)

onMounted(() => { if (familyStore.familyId) familyStore.loadFamily() })

const handleBuy = async (item) => {
  if (familyStore.points < item.cost) { showToast('积分不足'); return }
  if (item.stock <= 0) { showToast('库存不足'); return }
  const res = await showModal('确认兑换', `确定要花费${item.cost}积分兑换"${item.title}"吗？`)
  if (!res.confirm) return
  const result = familyStore.redeemStore(item._id, item.cost)
  if (result.ok) showToast('兑换成功！')
  else showToast(result.msg || '兑换失败')
}
</script>

<style scoped>
.store-page { min-height: 100vh; background: #f5f5f5; padding-bottom: 80px; }
.child-select { display: flex; align-items: center; padding: 10px 16px; background: #fff; margin: 10px; border-radius: 12px; }
.select-label { font-size: 14px; color: #666; }
.child-select-input { margin-left: 8px; font-size: 14px; color: #ff6b35; border: none; background: transparent; outline: none; }
.balance-card { background: linear-gradient(135deg, #ff6b35, #ff9a56); padding: 20px; text-align: center; margin: 10px; border-radius: 12px; }
.balance-label { font-size: 12px; color: rgba(255,255,255,.8); }
.balance-value { font-size: 42px; font-weight: bold; color: #fff; margin: 8px 0; }
.balance-hint { font-size: 11px; color: rgba(255,255,255,.7); }
.section { margin: 10px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.section-title { font-size: 17px; font-weight: bold; color: #333; }
.goods-list { background: #fff; border-radius: 10px; overflow: hidden; }
.goods-item { display: flex; align-items: center; padding: 14px; border-bottom: 1px solid #f5f5f5; }
.goods-item:last-child { border-bottom: none; }
.goods-item.out-of-stock { opacity: .5; }
.goods-icon { font-size: 26px; width: 44px; text-align: center; }
.goods-info { flex: 1; margin-left: 12px; }
.goods-name { font-size: 14px; color: #333; }
.goods-desc { font-size: 11px; color: #999; margin-top: 3px; }
.goods-stock { font-size: 10px; color: #ccc; margin-top: 3px; }
.goods-action { text-align: right; }
.goods-cost { font-size: 17px; font-weight: bold; color: #ff6b35; margin-bottom: 5px; }
.btn-buy { font-size: 12px; padding: 5px 14px; border-radius: 16px; background: #ff6b35; color: #fff; border: none; cursor: pointer; }
.btn-buy:disabled { background: #ccc; }
.record-list { background: #fff; border-radius: 10px; overflow: hidden; }
.record-item { display: flex; justify-content: space-between; align-items: center; padding: 14px; border-bottom: 1px solid #f5f5f5; }
.record-item:last-child { border-bottom: none; }
.record-info { display: flex; align-items: center; }
.record-icon { font-size: 18px; width: 28px; text-align: center; }
.record-name { font-size: 14px; color: #333; margin-left: 8px; }
.record-action { text-align: right; }
.record-cost { font-size: 14px; color: #ff4d4f; font-weight: bold; }
.record-time { font-size: 11px; color: #ccc; margin-top: 3px; }
.empty-record { padding: 30px; text-align: center; }
.empty-text { font-size: 13px; color: #ccc; }
</style>
