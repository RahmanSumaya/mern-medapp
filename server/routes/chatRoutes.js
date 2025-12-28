const express = require('express');
const router = express.Router();
const { chatWithAi } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Only logged-in users can use the AI
router.post('/ask', protect, chatWithAI);

module.exports = router;







