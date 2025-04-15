const asyncHandler = require('express-async-handler');
const Card = require('../models/Card');
const User = require('../models/User');

// @desc    获取用户卡片库存
// @route   GET /api/cards/inventory
// @access  Private
const getCardInventory = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('cardInventory');
  
  // 检查并重置每日卡片配额
  const today = new Date().setHours(0, 0, 0, 0);
  const lastIssued = user.dailyCards.lastIssued ? 
    new Date(user.dailyCards.lastIssued).setHours(0, 0, 0, 0) : null;

  if (lastIssued !== today) {
    user.dailyCards.blank = 3; // 重置为每日3张空白卡
    user.dailyCards.lastIssued = new Date();
    await user.save();
  }

  // 检查周期性卡片冷却
  const periodicCards = user.cardInventory.filter(card => 
    card.type === 'periodic' && card.cooldownUntil && card.cooldownUntil < new Date()
  );
  
  for (const card of periodicCards) {
    card.cooldownUntil = null;
    await card.save();
  }

  res.json({
    dailyCards: user.dailyCards,
    inventory: user.cardInventory
  });
});

// @desc    发放每日卡片
// @route   POST /api/cards/issue-daily
// @access  Private
const issueDailyCards = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  // 检查是否已发放
  const today = new Date().setHours(0, 0, 0, 0);
  const lastIssued = user.dailyCards.lastIssued ? 
    new Date(user.dailyCards.lastIssued).setHours(0, 0, 0, 0) : null;

  if (lastIssued === today) {
    res.status(400);
    throw new Error('今日卡片已发放');
  }

  // 创建3张空白卡片
  const blankCards = await Promise.all([...Array(3)].map(() => 
    Card.create({
      user: user._id,
      type: 'blank',
      title: '空白卡片',
      description: '可用于创建任意类型的任务',
      issuedAt: new Date()
    })
  ));

  // 更新用户卡片库存
  user.cardInventory.push(...blankCards.map(card => card._id));
  user.dailyCards.blank = 3;
  user.dailyCards.lastIssued = new Date();
  await user.save();

  res.status(201).json({
    message: '每日卡片发放成功',
    cards: blankCards
  });
});

// @desc    发放奖励卡片
// @route   POST /api/cards/issue-reward
// @access  Private
const issueRewardCard = asyncHandler(async (req, res) => {
  const { type, title, description, bonus } = req.body;
  
  // 创建奖励卡片
  const rewardCard = await Card.create({
    user: req.user.id,
    type: 'special',
    title,
    description,
    bonus,
    issuedAt: new Date()
  });

  // 更新用户卡片库存
  await User.findByIdAndUpdate(req.user.id, {
    $push: { cardInventory: rewardCard._id }
  });

  res.status(201).json({
    message: '奖励卡片发放成功',
    card: rewardCard
  });
});

// @desc    消耗卡片创建任务
// @route   POST /api/cards/consume
// @access  Private
const consumeCard = asyncHandler(async (req, res) => {
  const { cardId, taskData } = req.body;
  const user = await User.findById(req.user.id);

  // 1. 验证卡片
  const card = await Card.findOne({
    _id: cardId,
    user: req.user.id,
    used: false
  });

  if (!card) {
    res.status(400);
    throw new Error('无效的卡片');
  }

  // 2. 处理不同类型卡片
  let remainingCards = user.dailyCards.blank;
  
  if (card.type === 'blank') {
    // 检查每日配额
    if (remainingCards < 1) {
      res.status(400);
      throw new Error('今日空白卡片配额已用完');
    }
    remainingCards--;
  }

  // 3. 更新卡片状态
  if (card.type !== 'periodic') {
    card.used = true;
    await card.save();
  } else {
    // 处理周期性卡片冷却
    card.cooldownUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24小时冷却
    await card.save();
  }

  // 4. 更新用户数据
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { 'dailyCards.blank': card.type === 'blank' ? -1 : 0 },
    $pull: { cardInventory: card.type !== 'periodic' ? cardId : null }
  });

  // 5. 返回处理后的任务数据（包含加成）
  res.status(200).json({
    success: true,
    processedTask: {
      ...taskData,
      experienceReward: taskData.baseExperience * card.bonus.experienceMultiplier,
      goldReward: taskData.baseGold * card.bonus.goldMultiplier,
      cardUsed: cardId
    },
    remainingCards
  });
});

module.exports = {
  consumeCard,
  getCardInventory,
  issueDailyCards,
  issueRewardCard
};
