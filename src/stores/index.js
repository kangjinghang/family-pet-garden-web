import { defineStore } from 'pinia'

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback } catch { return fallback }
}

function save(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

const DEFAULT_STORE_ITEMS = [
  { _id: '1', icon: '🎮', title: '游戏时间30分钟', description: '可以玩30分钟游戏', cost: 50, stock: 99 },
  { _id: '2', icon: '🍦', title: '冰淇淋一个', description: '去超市买一个冰淇淋', cost: 30, stock: 5 },
  { _id: '3', icon: '🎬', title: '看一部电影', description: '选择一部喜欢的电影', cost: 80, stock: 3 },
  { _id: '4', icon: '🎪', title: '周末出游', description: '选择周末去哪里玩', cost: 200, stock: 1 },
  { _id: '5', icon: '🎁', title: '神秘礼物', description: '家长准备的小礼物', cost: 100, stock: 2 },
  { _id: '6', icon: '⏰', title: '晚睡30分钟', description: '今晚可以晚睡30分钟', cost: 40, stock: 99 },
]

export const useUserStore = defineStore('user', {
  state: () => load('userStore', { openid: '', nickName: '', avatarUrl: '', familyId: '' }),
  actions: {
    login(nickName, avatarUrl = '') {
      let user = load('local_user', null)
      if (!user) {
        user = { _id: genId(), openid: 'h5_' + genId(), nickName, avatarUrl, familyId: '', role: 'child', createdAt: new Date().toISOString() }
      } else {
        user.nickName = nickName
        user.avatarUrl = avatarUrl || user.avatarUrl
      }
      save('local_user', user)
      this.openid = user.openid
      this.nickName = nickName
      this.avatarUrl = avatarUrl
      this.familyId = user.familyId || ''
      save('userStore', this.$state)
      return user
    },
    restore() {
      const user = load('local_user', null)
      if (user && user.nickName) {
        this.openid = user.openid
        this.nickName = user.nickName
        this.avatarUrl = user.avatarUrl || ''
        this.familyId = user.familyId || ''
        save('userStore', this.$state)
      }
    },
    setFamilyId(familyId) {
      this.familyId = familyId
      save('userStore', this.$state)
      const user = load('local_user', null)
      if (user) { user.familyId = familyId; user.role = 'parent'; save('local_user', user) }
    },
    clearUser() {
      this.$reset()
      localStorage.removeItem('userStore')
    },
  },
})

export const useFamilyStore = defineStore('family', {
  state: () => load('familyStore', {
    familyId: '', familyName: '', inviteCode: '',
    members: [], children: [], badges: [], points: 0,
    selectedChildId: '', storeItems: [], redeemHistory: [], customRules: [],
  }),
  actions: {
    _persist() { save('familyStore', this.$state) },

    createFamily(familyName, childName, petType) {
      const user = load('local_user', null)
      if (!user) return { ok: false, msg: '请先登录' }
      const familyId = genId()
      const childId = genId()
      const family = {
        _id: familyId, name: familyName, inviteCode: Math.random().toString().slice(2, 8),
        parentId: user.openid, members: [user.openid],
        children: [{ id: childId, name: childName, pets: [{ id: genId(), name: '小萌宠', petType, stage: 'egg', level: 1, exp: 0, isMaxed: false }] }],
        badges: [], points: 0, customRules: [],
        storeItems: JSON.parse(JSON.stringify(DEFAULT_STORE_ITEMS)),
        redeemHistory: [], createdAt: new Date().toISOString(),
      }
      save('local_family_' + familyId, family)
      this._loadFromDoc(family)
      return { ok: true, familyId, inviteCode: family.inviteCode }
    },

    loadFamily() {
      if (!this.familyId) return false
      const doc = load('local_family_' + this.familyId, null)
      if (!doc) return false
      this._loadFromDoc(doc)
      return true
    },

    _loadFromDoc(doc) {
      this.familyId = doc._id || doc.familyId || ''
      this.familyName = doc.name || doc.familyName || ''
      this.inviteCode = doc.inviteCode || ''
      this.members = doc.members || []
      this.children = doc.children || []
      this.badges = doc.badges || []
      this.points = doc.points || 0
      this.storeItems = doc.storeItems || []
      this.redeemHistory = doc.redeemHistory || []
      this.customRules = doc.customRules || []
      if (!this.selectedChildId && this.children.length > 0) this.selectedChildId = this.children[0].id
      this._persist()
    },

    _saveFamily() {
      const doc = load('local_family_' + this.familyId, {})
      Object.assign(doc, {
        name: this.familyName, inviteCode: this.inviteCode, members: this.members,
        children: this.children, badges: this.badges, points: this.points,
        storeItems: this.storeItems, redeemHistory: this.redeemHistory, customRules: this.customRules,
      })
      save('local_family_' + this.familyId, doc)
      this._persist()
    },

    selectChild(id) { this.selectedChildId = id; this._persist() },

    getActivePet() {
      const child = this.children.find(c => c.id === this.selectedChildId)
      if (!child) return null
      return child.pets.find(p => !p.isMaxed) || child.pets[child.pets.length - 1]
    },
    getSelectedChild() {
      return this.children.find(c => c.id === this.selectedChildId) || null
    },

    completeTask(childId, ruleId, points, ruleTitle) {
      const family = load('local_family_' + this.familyId, null)
      if (!family) return { ok: false, msg: '家庭不存在' }
      const child = family.children.find(c => c.id === childId)
      if (!child) return { ok: false, msg: '孩子不存在' }
      const pet = child.pets.find(p => !p.isMaxed) || child.pets[child.pets.length - 1]
      const completionId = genId()
      const records = load('local_records_' + this.familyId, [])
      records.push({ _id: completionId, childId, ruleId, ruleTitle, pointsEarned: points, icon: '📝', completedAt: new Date().toISOString() })
      save('local_records_' + this.familyId, records)
      family.points += points
      let petLeveledUp = false, petGraduated = false
      if (pet) {
        pet.exp += points
        if (pet.exp >= pet.level * 100 && pet.level < 10) {
          pet.exp -= pet.level * 100; pet.level++
          petLeveledUp = true
          if (pet.level >= 9) { pet.stage = 'adult'; petGraduated = true }
          else if (pet.level >= 6) pet.stage = 'teen'
          else if (pet.level >= 3) pet.stage = 'child'
          else pet.stage = 'baby'
        }
      }
      save('local_family_' + this.familyId, family)
      this._loadFromDoc(family)
      return { ok: true, completionId, petLeveledUp, petGraduated, pointsEarned: points }
    },

    undoTask(childId, completionId) {
      const family = load('local_family_' + this.familyId, null)
      if (!family) return { ok: false, msg: '家庭不存在' }
      const records = load('local_records_' + this.familyId, [])
      const record = records.find(r => r._id === completionId)
      if (!record) return { ok: false, msg: '记录不存在' }
      family.points = Math.max(0, family.points - record.pointsEarned)
      const child = family.children.find(c => c.id === childId)
      if (child) {
        const pet = child.pets.find(p => !p.isMaxed) || child.pets[child.pets.length - 1]
        if (pet) pet.exp = Math.max(0, pet.exp - record.pointsEarned)
      }
      save('local_records_' + this.familyId, records.filter(r => r._id !== completionId))
      save('local_family_' + this.familyId, family)
      this._loadFromDoc(family)
      return { ok: true }
    },

    getTodayRecords(childId) {
      const records = load('local_records_' + this.familyId, [])
      const today = new Date(); today.setHours(0, 0, 0, 0)
      return records.filter(r => {
        const d = new Date(r.completedAt); d.setHours(0, 0, 0, 0)
        return d.getTime() === today.getTime() && r.childId === childId
      })
    },

    addChild(childName, petType) {
      const child = { id: genId(), name: childName, pets: [{ id: genId(), name: '小萌宠', petType, stage: 'egg', level: 1, exp: 0, isMaxed: false }] }
      this.children.push(child)
      if (!this.selectedChildId) this.selectedChildId = child.id
      this._saveFamily()
      return child
    },

    switchPet(childId, petId, newPetType) {
      const family = load('local_family_' + this.familyId, null)
      if (!family) return false
      const child = family.children.find(c => c.id === childId)
      if (!child) return false
      const pet = child.pets.find(p => p.id === petId)
      if (!pet) return false
      pet.petType = newPetType; pet.stage = 'egg'; pet.level = 1; pet.exp = 0; pet.isMaxed = false
      save('local_family_' + this.familyId, family)
      this._loadFromDoc(family)
      return true
    },

    redeemStore(itemId, cost) {
      const family = load('local_family_' + this.familyId, null)
      if (!family) return { ok: false, msg: '家庭不存在' }
      const item = family.storeItems.find(i => i._id === itemId)
      if (!item) return { ok: false, msg: '商品不存在' }
      if (family.points < cost) return { ok: false, msg: '积分不足' }
      if (item.stock <= 0) return { ok: false, msg: '库存不足' }
      family.points -= cost; item.stock--
      const now = new Date()
      const timeStr = `${now.getMonth() + 1}月${now.getDate()}日 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      family.redeemHistory.unshift({ id: genId(), icon: item.icon, title: item.title, cost, time: timeStr })
      if (family.redeemHistory.length > 50) family.redeemHistory = family.redeemHistory.slice(0, 50)
      save('local_family_' + this.familyId, family)
      this._loadFromDoc(family)
      return { ok: true }
    },

    updateCustomRules(rules) {
      this.customRules = rules
      this._saveFamily()
    },
  },
})
