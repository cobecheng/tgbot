require('dotenv').config();
const express = require('express');
const { Bot } = require('grammy');

const bot = new Bot(process.env.BOT_TOKEN); // Initialize the bot
const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Webhook route
const webhookPath = '/webhook';

// Add webhook callback
app.use(webhookPath, bot.webhookCallback(webhookPath));

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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    // Set Telegram webhook
    const webhookUrl = `https://tgbot-xn2d.onrender.com${webhookPath}`;
    try {
        await bot.api.setWebhook(webhookUrl);
        console.log(`Webhook successfully set to ${webhookUrl}`);
    } catch (error) {
        console.error('Error setting webhook:', error);
    }
});
