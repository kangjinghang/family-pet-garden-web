<template>
  <div class="home-page">
    <div v-if="!userStore.nickName" class="login-tip" @click="router.push('/login')">
      <span class="tip-text">点击登录，开始使用</span>
      <span class="tip-arrow">›</span>
    </div>

    <ChildSelector
      v-if="familyStore.children.length > 0"
      :children="familyStore.children"
      :selectedId="familyStore.selectedChildId"
      @select="familyStore.selectChild"
      @add="showAddChildModal = true"
    />

    <PetCard
      v-if="activePet"
      :petStage="activePet.stage" :petLevel="activePet.level" :petExp="activePet.exp"
      :petName="activePet.name" :petType="activePet.petType || 'cat'" :hatchNeeded="20" :celebrate="celebrating"
      @hatch="showNameModal = true" @switchPet="handleSwitchPet"
    />

    <div v-else class="pet-card demo-pet">
      <div class="egg-container">
        <div class="egg">🥚</div>
        <p class="demo-hint">创建一个家庭，和孩子一起养成好习惯吧</p>
        <button class="btn-start" @click="router.push('/family?action=create')">创建家庭开始养宠</button>
      </div>
    </div>

    <ScoreBar v-if="familyStore.familyId" :points="familyStore.points" :completedToday="completedCount" :streak="streak" />

    <div v-if="familyStore.familyId" class="section">
      <h3 class="section-title">今日记录</h3>
      <div v-if="todayRecords.length === 0" class="empty-records">
        <div class="empty-emoji">📝</div>
        <p class="empty-text">还没有记录，试试给宝贝评个分吧</p>
      </div>
      <div v-else class="record-list">
        <div v-for="record in visibleRecords" :key="record._id" class="record-item">
          <span class="record-icon">{{ record.icon }}</span>
          <span class="record-title">{{ record.title }}</span>
          <span class="record-points" :class="{ negative: record.pointsEarned < 0 }">
            {{ record.pointsEarned > 0 ? '+' : '' }}{{ record.pointsEarned }}
          </span>
          <button class="record-undo" @click="handleUndo(record)">撤回</button>
        </div>
      </div>
      <div v-if="todayRecords.length > 5 && !showAllRecords" class="expand-btn" @click="showAllRecords = true">
        <span class="expand-text">查看全部 {{ todayRecords.length }} 条 ↓</span>
      </div>
      <div v-if="showAllRecords && todayRecords.length > 5" class="expand-btn" @click="showAllRecords = false">
        <span class="expand-text">收起 ↑</span>
      </div>
    </div>

    <div v-if="familyStore.familyId && activePet" class="section">
      <template v-if="activePet.stage === 'egg'">
        <h3 class="section-title">给{{ childName }}评分</h3>
        <p class="egg-guide">完成评分即可为宠物赚取经验，集满经验后宠物蛋就能孵化啦！</p>
        <ScoringPanel :rules="scoringRules" @apply="handleScoring" />
      </template>
      <template v-else>
        <h3 class="section-title">快速评分</h3>
        <ScoringPanel :rules="scoringRules" @apply="handleScoring" />
      </template>
    </div>

    <BadgeWall v-if="familyStore.familyId" :badges="familyStore.badges || []" />

    <div v-if="userStore.nickName && !familyStore.familyId" class="no-family">
      <p class="no-family-text">还没有加入家庭</p>
      <button class="btn-primary" @click="router.push('/family?action=create')">创建家庭</button>
    </div>

    <NameModal :visible="showNameModal" title="孵化成功！" content="你的小宠物破壳而出了！给它起个名字吧：" placeholder="输入宠物名字（留空默认小萌宠）"
      @confirm="handleNameConfirm" @cancel="showNameModal = false" />
    <AddChildModal :visible="showAddChildModal" title="添加孩子" placeholder="如：大宝"
      @confirm="handleAddChild" @cancel="showAddChildModal = false" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore, useFamilyStore } from '@/stores/index.js'
import { showToast, showModal } from '@/utils/toast.js'
import PetCard from '@/components/PetCard.vue'
import ScoreBar from '@/components/ScoreBar.vue'
import ScoringPanel from '@/components/ScoringPanel.vue'
import ChildSelector from '@/components/ChildSelector.vue'
import NameModal from '@/components/NameModal.vue'
import AddChildModal from '@/components/AddChildModal.vue'
import BadgeWall from '@/components/BadgeWall.vue'

const router = useRouter()
const userStore = useUserStore()
const familyStore = useFamilyStore()

const showNameModal = ref(false)
const showAddChildModal = ref(false)
const celebrating = ref(false)
const showAllRecords = ref(false)
const isScoring = ref(false)
const todayRecords = ref([])
const completedCount = ref(0)
const streak = ref(1)

const activePet = computed(() => familyStore.getActivePet())
const childName = computed(() => familyStore.getSelectedChild()?.name || '宝贝')
const visibleRecords = computed(() => showAllRecords.value ? todayRecords.value : todayRecords.value.slice(0, 5))

const scoringRules = ref([
  { id: '1', icon: '📚', title: '认真写作业', description: '专注完成作业', points: 5, category: '学习' },
  { id: '2', icon: '📖', title: '阅读课外书', description: '阅读15分钟以上', points: 4, category: '学习' },
  { id: '3', icon: '✏️', title: '练字', description: '认真练字15分钟', points: 3, category: '学习' },
  { id: '4', icon: '🧮', title: '做口算', description: '完成口算练习', points: 3, category: '学习' },
  { id: '5', icon: '🎵', title: '练琴', description: '认真练琴30分钟', points: 5, category: '学习' },
  { id: '6', icon: '🗣️', title: '背诵课文', description: '流利背诵', points: 4, category: '学习' },
  { id: '7', icon: '🧹', title: '整理房间', description: '自己整理房间', points: 3, category: '行为' },
  { id: '8', icon: '🍽️', title: '帮忙做饭', description: '参与做饭', points: 4, category: '行为' },
  { id: '9', icon: '🧺', title: '洗碗', description: '饭后主动洗碗', points: 3, category: '行为' },
  { id: '10', icon: '🛏️', title: '叠被子', description: '起床后叠被子', points: 2, category: '行为' },
  { id: '11', icon: '👟', title: '整理鞋柜', description: '鞋子摆放整齐', points: 2, category: '行为' },
  { id: '12', icon: '🪥', title: '刷牙', description: '早晚刷牙', points: 2, category: '健康' },
  { id: '13', icon: '🥦', title: '吃蔬菜', description: '不挑食吃蔬菜', points: 3, category: '健康' },
  { id: '14', icon: '🏃', title: '运动', description: '户外运动30分钟', points: 4, category: '健康' },
  { id: '15', icon: '😴', title: '早睡', description: '按时上床睡觉', points: 3, category: '健康' },
  { id: '16', icon: '⏰', title: '早起', description: '闹钟响后起床', points: 2, category: '健康' },
  { id: '17', icon: '💧', title: '多喝水', description: '喝够8杯水', points: 2, category: '健康' },
  { id: '18', icon: '😊', title: '说谢谢', description: '主动表达感谢', points: 2, category: '行为' },
  { id: '19', icon: '🤝', title: '帮助他人', description: '主动帮助家人', points: 4, category: '行为' },
  { id: '20', icon: '📱', title: '少看屏幕', description: '控制屏幕时间', points: 3, category: '行为' },
  { id: '21', icon: '🎯', title: '专注力', description: '专注做一件事', points: 3, category: '行为' },
  { id: '22', icon: '🎁', title: '分享', description: '愿意分享物品', points: 3, category: '行为' },
  { id: '23', icon: '😤', title: '发脾气', description: '乱发脾气', points: -3, category: '扣分' },
  { id: '24', icon: '📉', title: '说谎', description: '被发现说谎', points: -5, category: '扣分' },
])

function refreshRecords() {
  if (!familyStore.familyId) return
  const child = familyStore.getSelectedChild()
  if (!child) return
  const records = familyStore.getTodayRecords(child.id)
  todayRecords.value = records.map(r => ({ _id: r._id, icon: r.icon || '📝', title: r.ruleTitle || '', pointsEarned: r.pointsEarned }))
  completedCount.value = todayRecords.value.length
  streak.value = todayRecords.value.filter(r => r.pointsEarned > 0).length > 0 ? 1 : 0
}

onMounted(() => {
  if (familyStore.familyId) familyStore.loadFamily()
  refreshRecords()
})

watch(() => familyStore.selectedChildId, () => { showAllRecords.value = false; refreshRecords() })

const handleScoring = async (rule) => {
  if (isScoring.value) return
  const child = familyStore.getSelectedChild()
  if (!child) { showToast('请先选择孩子'); return }
  isScoring.value = true
  try {
    const result = familyStore.completeTask(child.id, rule.id, rule.points, rule.title)
    if (result.ok) {
      todayRecords.value.unshift({ _id: result.completionId, icon: rule.icon, title: rule.title, pointsEarned: rule.points })
      completedCount.value++
      if (result.petGraduated) {
        const pet = familyStore.getActivePet()
        if (child && pet) familyStore.badges.push({ id: Date.now().toString(), childId: child.id, childName: child.name, petType: pet.petType, petName: pet.name, graduatedAt: new Date().toISOString() })
        showToast(`🏆 ${pet?.name}毕业了！获得徽章！`, 3000)
        celebrating.value = true; setTimeout(() => { celebrating.value = false }, 2000)
      } else if (result.petLeveledUp) {
        showToast(`🎉 +${rule.points}积分！宠物升级了！`, 2500)
        celebrating.value = true; setTimeout(() => { celebrating.value = false }, 2000)
      } else {
        showToast(`${rule.points > 0 ? '+' : ''}${rule.points}积分`)
      }
    }
  } catch { showToast('评分失败') } finally { setTimeout(() => { isScoring.value = false }, 300) }
}

const handleUndo = async (record) => {
  const child = familyStore.getSelectedChild()
  if (!child) return
  const res = await showModal('确认撤回', `撤回「${record.title}」${record.pointsEarned > 0 ? '+' : ''}${record.pointsEarned}积分？`)
  if (!res.confirm) return
  const result = familyStore.undoTask(child.id, record._id)
  if (result.ok) {
    todayRecords.value = todayRecords.value.filter(r => r._id !== record._id)
    completedCount.value = Math.max(0, completedCount.value - 1)
    showToast('已撤回')
  }
}

const handleSwitchPet = (newPetType) => {
  const child = familyStore.getSelectedChild()
  const pet = familyStore.getActivePet()
  if (!child || !pet) return
  if (familyStore.switchPet(child.id, pet.id, newPetType)) showToast('换宠成功')
  else showToast('换宠失败')
}

const handleNameConfirm = (name) => {
  showNameModal.value = false
  const pet = familyStore.getActivePet()
  if (pet) { pet.stage = 'baby'; pet.name = name || '小萌宠'; familyStore._saveFamily(); showToast('孵化成功！') }
}

const handleAddChild = ({ name, petType }) => {
  showAddChildModal.value = false
  if (!name) { showToast('请输入孩子昵称'); return }
  familyStore.addChild(name, petType)
  showToast('添加成功')
}
</script>

<style scoped>
.home-page { min-height: 100vh; background: #f5f5f5; padding-bottom: 80px; }
.login-tip { display: flex; align-items: center; justify-content: space-between; background: #fff5f0; padding: 10px 16px; cursor: pointer; }
.tip-text { font-size: 13px; color: #ff6b35; }
.tip-arrow { font-size: 18px; color: #ff6b35; }
.pet-card { background: linear-gradient(135deg, #fff5f0, #fff); border-radius: 12px; padding: 16px; margin: 10px; }
.egg-container { text-align: center; padding: 10px 0; }
.egg { font-size: 64px; animation: float 2s ease-in-out infinite; }
.demo-hint { font-size: 13px; color: #999; margin-top: 10px; }
.btn-start { background: linear-gradient(135deg, #ff6b35, #ff9a56); color: #fff; border: none; border-radius: 25px; font-size: 15px; margin-top: 16px; padding: 10px 30px; cursor: pointer; }
.section { background: #fff; margin: 10px; border-radius: 12px; padding: 16px; }
.section-title { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 10px; }
.record-item { display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
.record-icon { font-size: 18px; width: 28px; }
.record-title { flex: 1; font-size: 14px; color: #333; margin-left: 8px; }
.record-points { font-size: 14px; color: #ff6b35; font-weight: bold; }
.record-points.negative { color: #999; }
.record-undo { font-size: 12px; color: #999; margin-left: 12px; background: none; border: none; cursor: pointer; padding: 2px 6px; }
.record-undo:hover { color: #ff6b35; }
.egg-guide { font-size: 13px; color: #999; text-align: center; margin-bottom: 10px; }
.expand-btn { text-align: center; padding: 8px 0; }
.expand-text { font-size: 12px; color: #ff6b35; cursor: pointer; }
.no-family { text-align: center; padding: 30px 20px; }
.no-family-text { font-size: 14px; color: #999; margin-bottom: 16px; }
.btn-primary { background: linear-gradient(135deg, #ff6b35, #ff9a56); color: #fff; border: none; border-radius: 25px; font-size: 15px; margin-bottom: 12px; padding: 10px 30px; cursor: pointer; }
.empty-records { padding: 20px 0; text-align: center; }
.empty-emoji { font-size: 36px; margin-bottom: 6px; }
.empty-text { font-size: 13px; color: #ccc; }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
</style>
