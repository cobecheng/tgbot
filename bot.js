require('dotenv').config();
const express = require('express');
const { Composer, Bot, InlineKeyboard, session } = require('grammy');

const bot = new Bot(process.env.BOT_TOKEN);
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

// Simple start command to ensure the bot is working
bot.command('start', (ctx) => {

    const url = 'https://9c21-93-152-210-204.ngrok-free.app/create-family';
  
    const keyboard = new InlineKeyboard().webApp('Open Adventure', url);
  
    ctx.reply(`Hey! I'm here to notify you about your RPG adventures.`, { reply_markup: keyboard });
  });


// Handle "Create Family" requests
app.post('/create-family', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).send({ error: 'User ID is required' });
  }

  try {
    // Create a new group chat
    const chatTitle = `Family Group for User ${userId}`;
    const newGroup = await bot.api.createChat({ type: 'group', title: chatTitle });

    // Add the user to the group
    await bot.api.addChatMember(newGroup.id, userId);

    // Optionally, send a message in the group
    await bot.api.sendMessage(newGroup.id, `Welcome to your new family group, User ${userId}!`);

    return res.send({ success: true, groupTitle: chatTitle });
  } catch (error) {
    console.error('Error creating family group:', error);
    return res.status(500).send({ error: 'Failed to create family group.' });
  }
});

// Start the bot and the backend server
bot.start();
// bot.js
app.listen(4000, () => {
    console.log('Bot backend is running on port 4000');
  });
