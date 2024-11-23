require('dotenv').config();
const express = require('express');
const { Bot, InlineKeyboard } = require('grammy');

const bot = new Bot(process.env.BOT_TOKEN); // Initialize bot with token
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

// Webhook endpoint
const webhookPath = '/webhook';
const webhookUrl = `https://tgbot-xn2d.onrender.com${webhookPath}`;

// Telegram command for starting interaction
bot.command('start', (ctx) => {
  const keyboard = new InlineKeyboard().webApp('Open Adventure', 'https://createfamily.onrender.com/');
  ctx.reply('Hey! I’m here to notify you about your RPG adventures.', { reply_markup: keyboard });
});

// Create Family API
app.post('/create-family', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Simulate group creation by sending a message to the user
    const message = `Family group simulation: Welcome, User ${userId}!`;

    // You can replace this logic with another implementation (e.g., notifying admins to create a group)
    await bot.api.sendMessage(userId, message);

    return res.status(200).json({ success: true, message });
  } catch (error) {
    console.error('Error creating family group:', error);
    return res.status(500).json({ error: 'Failed to create family group.' });
  }
});

// Setup webhook
app.use(bot.webhookCallback(webhookPath));

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Bot backend is running on port ${PORT}`);
  await bot.api.setWebhook(webhookUrl); // Set Telegram webhook
});
