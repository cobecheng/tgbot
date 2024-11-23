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

// Handle API request from React
app.post('/create-family', async (req, res) => {
    const { userId } = req.body;
  
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
  
    try {
      await bot.api.sendMessage(userId, `Family group created for User ${userId}.`);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to send message.' });
    }
  });

// Attach Telegram bot webhook
app.use(webhookPath, bot.webhookCallback(webhookPath));

// Start Express server and set the webhook
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    // Set webhook for Telegram bot
    await bot.api.setWebhook(webhookUrl);
    console.log(`Webhook set to ${webhookUrl}`);
  } catch (error) {
    console.error('Error setting webhook:', error);
  }
});
