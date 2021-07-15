const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender, read } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const conversationSearch = await Conversation.findByPk(conversationId);
      const { dataValues } = conversationSearch;
      const { user1Id, user2Id } = dataValues;

      if (senderId === user1Id || senderId === user2Id) {
        const message = await Message.create({
          senderId,
          text,
          conversationId,
        });
        return res.json({ message, sender });
      } else {
        res.status(401).json({ error: "User is not part of conversation." });
      }
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
      read,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.patch("/status", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const { messageId, readStatus } = req.body;
    const messageQuery = await Message.update({ read: readStatus }, {
      where: {
        id: messageId,
      }
    });

    res.json({
      success: `Succesfully updated status of message to ${readStatus}.`,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
