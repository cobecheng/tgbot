require('dotenv').config();
const express = require('express');
const MTProto = require('@mtproto/core');
const { Bot } = require('grammy');

// Initialize MTProto (Telegram client for MTProto API)
const mtproto = new MTProto({
  api_id: process.env.TELEGRAM_API_ID,
  api_hash: process.env.TELEGRAM_API_HASH,
});

// Initialize Telegram Bot (Bot API)
const bot = new Bot(process.env.BOT_TOKEN);

// Express app
const app = express();
app.use(express.json());

// Create Family API Endpoint
app.post('/create-family', async (req, res) => {
  const { telegramUserId } = req.body;
  if (!telegramUserId) {
    return res.status(400).json({ error: 'telegramUserId is required' });
  }

  try {
    // Step 1: Get the user's details
    const user = await bot.api.getChat(telegramUserId);

    // Step 2: Create the group using MTProto
    const groupName = `Family Group for ${user.first_name}`;
    const group = await mtproto.call('messages.createChat', {
      users: [
        { _: 'inputUser', user_id: telegramUserId }, // The user to invite
      ],
      title: groupName,
    });

    // Step 3: Invite the user to the group
    await mtproto.call('messages.addChatUser', {
      chat_id: group.chat.id,
      user_id: { _: 'inputUser', user_id: telegramUserId },
    });

    // Respond to the mini-app
    res.json({ success: true, groupName });
  } catch (error) {
    console.error('Error creating family group:', error);
    res.status(500).json({ error: 'Failed to create family group.' });
  }
});

// Start Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

// Start Telegram Bot
bot.start();
