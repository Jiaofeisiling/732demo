const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  consumeCard,
  getCardInventory,
  issueDailyCards,
  issueRewardCard
} = require('../controllers/cardController');

// 获取卡片库存
router.route('/inventory')
  .get(protect, getCardInventory);

// 发放每日卡片
router.route('/issue-daily')
  .post(protect, issueDailyCards);

// 发放奖励卡片
router.route('/issue-reward')
  .post(protect, issueRewardCard);

// 卡片消耗接口
router.route('/consume')
  .post(protect, consumeCard);

module.exports = router;
