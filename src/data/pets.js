export const PET_CATEGORIES = [
  { key: 'cute', name: '萌宠系', icon: '🐾' },
  { key: 'mythical', name: '山海系', icon: '🐉' },
  { key: 'spirit', name: '精灵系', icon: '✨' },
  { key: 'cartoon', name: '动画系', icon: '🎬' },
]

export const PETS = [
  { id: 'cat', name: '小猫咪', emoji: '🐱', category: 'cute', desc: '温柔陪伴的小猫咪' },
  { id: 'dog', name: '小狗狗', emoji: '🐶', category: 'cute', desc: '忠诚可爱的小狗狗' },
  { id: 'rabbit', name: '小白兔', emoji: '🐰', category: 'cute', desc: '蹦蹦跳跳的小白兔' },
  { id: 'hamster', name: '小仓鼠', emoji: '🐹', category: 'cute', desc: '圆滚滚的小仓鼠' },
  { id: 'fox', name: '小狐狸', emoji: '🦊', category: 'cute', desc: '机灵聪明的小狐狸' },
  { id: 'bear', name: '小熊', emoji: '🐻', category: 'cute', desc: '憨态可掬的小熊' },
  { id: 'panda', name: '小熊猫', emoji: '🐼', category: 'cute', desc: '国宝级可爱的小熊猫' },
  { id: 'koala', name: '考拉', emoji: '🐨', category: 'cute', desc: '爱睡觉的考拉' },
  { id: 'penguin', name: '小企鹅', emoji: '🐧', category: 'cute', desc: '摇摇摆摆的小企鹅' },
  { id: 'chick', name: '小鸡仔', emoji: '🐤', category: 'cute', desc: '叽叽喳喳的小鸡仔' },
  { id: 'duck', name: '小鸭子', emoji: '🦆', category: 'cute', desc: '嘎嘎叫的小鸭子' },
  { id: 'pig', name: '小猪猪', emoji: '🐷', category: 'cute', desc: '粉嫩可爱的小猪猪' },
  { id: 'sheep', name: '小羊仔', emoji: '🐑', category: 'cute', desc: '软绵绵的小羊仔' },
  { id: 'cow', name: '小牛牛', emoji: '🐮', category: 'cute', desc: '勤劳的小牛牛' },
  { id: 'horse', name: '小马驹', emoji: '🐴', category: 'cute', desc: '奔跑吧小马驹' },
  { id: 'monkey', name: '小猴子', emoji: '🐵', category: 'cute', desc: '调皮的小猴子' },
  { id: 'tiger', name: '小老虎', emoji: '🐯', category: 'cute', desc: '威风凛凛的小老虎' },
  { id: 'lion', name: '小狮子', emoji: '🦁', category: 'cute', desc: '森林之王小狮子' },
  { id: 'elephant', name: '小象', emoji: '🐘', category: 'cute', desc: '长鼻子小象' },
  { id: 'whale', name: '小鲸鱼', emoji: '🐳', category: 'cute', desc: '海洋里的小鲸鱼' },
  { id: 'dragon', name: '青龙', emoji: '🐲', category: 'mythical', desc: '东方神龙' },
  { id: 'phoenix', name: '朱雀', emoji: '🔥', category: 'mythical', desc: '浴火重生的神鸟' },
  { id: 'tortoise', name: '玄武', emoji: '🐢', category: 'mythical', desc: '长寿的神兽' },
  { id: 'unicorn', name: '独角兽', emoji: '🦄', category: 'spirit', desc: '纯洁的独角兽' },
  { id: 'sparkle', name: '小精灵', emoji: '🧚', category: 'spirit', desc: '闪闪发光的小精灵' },
  { id: 'dinosaur', name: '小恐龙', emoji: '🦕', category: 'cartoon', desc: '穿越时空的小恐龙' },
  { id: 'robot', name: '小机器人', emoji: '🤖', category: 'cartoon', desc: '智能可爱的小机器人' },
]

export function getPetById(petId) {
  return PETS.find(p => p.id === petId) || PETS[0]
}
