<template>
  <div class="rules-page">
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">我的规则</h3>
        <button class="section-add" @click="showAddModal = true">+ 添加</button>
      </div>
      <div class="rules-list">
        <div v-for="rule in familyStore.customRules" :key="rule.id" class="rule-item">
          <div class="rule-info">
            <span class="rule-icon">{{ rule.icon }}</span>
            <div class="rule-content">
              <p class="rule-title">{{ rule.title }}</p>
              <p class="rule-points" :class="{ positive: rule.points > 0, negative: rule.points < 0 }">
                {{ rule.points > 0 ? '+' : '' }}{{ rule.points }}分 · {{ rule.category }}
              </p>
            </div>
          </div>
          <div class="rule-actions">
            <button class="btn-edit" @click="editRule(rule)">编辑</button>
            <button class="btn-delete" @click="handleDelete(rule)">删除</button>
          </div>
        </div>
        <div v-if="familyStore.customRules.length === 0" class="empty-rules">
          <p class="empty-text">还没有自定义规则</p>
          <p class="empty-hint">点击右上角"添加"创建自定义规则</p>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-header"><h3 class="section-title">常用规则</h3></div>
      <div class="preset-list">
        <div v-for="rule in presetRules" :key="rule.id" class="preset-item" @click="addPreset(rule)">
          <span class="preset-icon">{{ rule.icon }}</span>
          <span class="preset-title">{{ rule.title }}</span>
          <span class="preset-points" :class="{ positive: rule.points > 0, negative: rule.points < 0 }">
            {{ rule.points > 0 ? '+' : '' }}{{ rule.points }}
          </span>
        </div>
      </div>
    </div>
    <div v-if="showAddModal" class="modal-mask" @click="showAddModal = false">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">{{ editingRule ? '编辑规则' : '添加规则' }}</h3>
        <div class="form-group">
          <label class="form-label">规则名称</label>
          <input class="form-input" v-model="formData.title" placeholder="如：主动整理房间" />
        </div>
        <div class="form-group">
          <label class="form-label">积分</label>
          <input class="form-input" v-model.number="formData.points" type="number" placeholder="如：3 或 -2" />
        </div>
        <div class="form-group">
          <label class="form-label">分类</label>
          <div class="category-options">
            <span v-for="cat in categories" :key="cat.key" class="category-option" :class="{ active: formData.category === cat.key }" @click="formData.category = cat.key">
              {{ cat.icon }} {{ cat.name }}
            </span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">图标</label>
          <div class="icon-options">
            <span v-for="icon in iconOptions" :key="icon" class="icon-option" :class="{ active: formData.icon === icon }" @click="formData.icon = icon">
              {{ icon }}
            </span>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showAddModal = false">取消</button>
          <button class="btn-confirm" @click="saveRule">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFamilyStore } from '@/stores/index.js'
import { showToast, showModal } from '@/utils/toast.js'

const familyStore = useFamilyStore()
const showAddModal = ref(false)
const editingRule = ref(null)
const formData = ref({ title: '', points: 1, category: 'behavior', icon: '⭐' })
const categories = [
  { key: 'study', name: '学习', icon: '📚' }, { key: 'behavior', name: '行为', icon: '👤' },
  { key: 'health', name: '健康', icon: '💪' }, { key: 'other', name: '其他', icon: '📌' },
]
const iconOptions = ['⭐', '👍', '💪', '🎯', '✅', '❤️', '🏆', '✨', '🎉', '📖', '🎨', '🎵', '⚽', '🧹', '🧸', '❌', '😤', '💔']
const presetRules = [
  { id: 101, icon: '📖', title: '课外阅读30分钟', points: 3, category: 'study' },
  { id: 102, icon: '🎹', title: '练琴20分钟', points: 3, category: 'other' },
  { id: 103, icon: '🏃', title: '跑步1公里', points: 4, category: 'health' },
  { id: 104, icon: '🧩', title: '完成一份练习题', points: 3, category: 'study' },
  { id: 105, icon: '🛏️', title: '叠被子', points: 1, category: 'behavior' },
  { id: 106, icon: '🐶', title: '遛狗15分钟', points: 2, category: 'behavior' },
]

const sync = () => familyStore.updateCustomRules(familyStore.customRules)

const editRule = (rule) => { editingRule.value = rule; formData.value = { ...rule }; showAddModal.value = true }

const handleDelete = async (rule) => {
  const res = await showModal('确认删除', `确定要删除规则"${rule.title}"吗？`)
  if (!res.confirm) return
  familyStore.customRules = familyStore.customRules.filter(r => r.id !== rule.id)
  sync(); showToast('已删除')
}

const addPreset = (rule) => { familyStore.customRules.push({ id: Date.now().toString(), ...rule }); sync(); showToast('已添加') }

const saveRule = () => {
  if (!formData.value.title) { showToast('请输入规则名称'); return }
  if (!formData.value.points) { showToast('请输入积分'); return }
  const points = parseInt(formData.value.points)
  if (editingRule.value) {
    const i = familyStore.customRules.findIndex(r => r.id === editingRule.value.id)
    if (i !== -1) familyStore.customRules[i] = { ...familyStore.customRules[i], title: formData.value.title, points, category: formData.value.category, icon: formData.value.icon }
  } else {
    familyStore.customRules.push({ id: Date.now().toString(), title: formData.value.title, points, category: formData.value.category, icon: formData.value.icon })
  }
  sync(); showAddModal.value = false; editingRule.value = null
  formData.value = { title: '', points: 1, category: 'behavior', icon: '⭐' }; showToast('保存成功')
}
</script>

<style scoped>
.rules-page { min-height: 100vh; background: #f5f5f5; }
.section { margin: 10px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.section-title { font-size: 17px; font-weight: bold; color: #333; }
.section-add { font-size: 13px; color: #ff6b35; background: none; border: none; cursor: pointer; }
.rules-list { background: #fff; border-radius: 10px; overflow: hidden; }
.rule-item { display: flex; justify-content: space-between; align-items: center; padding: 14px; border-bottom: 1px solid #f5f5f5; }
.rule-item:last-child { border-bottom: none; }
.rule-info { display: flex; align-items: center; flex: 1; }
.rule-icon { font-size: 22px; width: 36px; text-align: center; }
.rule-content { margin-left: 8px; }
.rule-title { font-size: 14px; color: #333; }
.rule-points { font-size: 11px; margin-top: 3px; }
.rule-points.positive { color: #52c41a; }
.rule-points.negative { color: #ff4d4f; }
.rule-actions { display: flex; gap: 12px; }
.btn-edit { font-size: 12px; color: #ff6b35; background: none; border: none; cursor: pointer; }
.btn-delete { font-size: 12px; color: #ff4d4f; background: none; border: none; cursor: pointer; }
.empty-rules { padding: 30px; text-align: center; }
.empty-text { font-size: 14px; color: #ccc; }
.empty-hint { font-size: 11px; color: #ddd; margin-top: 5px; }
.preset-list { background: #fff; border-radius: 10px; overflow: hidden; }
.preset-item { display: flex; align-items: center; padding: 14px; border-bottom: 1px solid #f5f5f5; cursor: pointer; }
.preset-item:last-child { border-bottom: none; }
.preset-icon { font-size: 18px; width: 28px; text-align: center; }
.preset-title { flex: 1; font-size: 14px; color: #333; margin-left: 8px; }
.preset-points { font-size: 14px; font-weight: bold; }
.preset-points.positive { color: #52c41a; }
.preset-points.negative { color: #ff4d4f; }
.modal-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; z-index: 999; }
.modal-content { width: 80%; max-width: 400px; background: #fff; border-radius: 12px; padding: 20px; max-height: 80vh; overflow-y: auto; }
.modal-title { font-size: 17px; font-weight: bold; color: #333; text-align: center; margin-bottom: 16px; }
.form-group { margin-bottom: 16px; }
.form-label { font-size: 13px; color: #666; display: block; margin-bottom: 8px; }
.form-input { width: 100%; border: 1px solid #eee; border-radius: 8px; padding: 10px; font-size: 14px; }
.category-options { display: flex; flex-wrap: wrap; gap: 8px; }
.category-option { padding: 6px 12px; border: 1px solid #eee; border-radius: 16px; font-size: 12px; color: #666; cursor: pointer; }
.category-option.active { border-color: #ff6b35; color: #ff6b35; background: #fff5f0; }
.icon-options { display: flex; flex-wrap: wrap; gap: 8px; }
.icon-option { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid #eee; border-radius: 8px; font-size: 18px; cursor: pointer; }
.icon-option.active { border-color: #ff6b35; background: #fff5f0; }
.modal-actions { display: flex; gap: 12px; margin-top: 16px; }
.btn-cancel { flex: 1; background: #f5f5f5; color: #666; border: none; border-radius: 25px; font-size: 14px; padding: 10px; cursor: pointer; }
.btn-confirm { flex: 1; background: #ff6b35; color: #fff; border: none; border-radius: 25px; font-size: 14px; padding: 10px; cursor: pointer; }
</style>
