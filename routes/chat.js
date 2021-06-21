const { ChatMessage } = require("../models/index");
const { User } = require("../models/index");

exports.readMany = async (req, res) => {
  try {
    const chatMessages = await ChatMessage.findAll({
      where: { ContentId: req.params.id },
      order: [["createdAt", "ASC"]],
      include: [User],
      limit: 100 // only 100 most recent messages
    });

    res.json(chatMessages);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.create = async (req, res) => {
  try {
    let instance = await ChatMessage.create(req.body);
    return res.json([instance, true]);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.delete = async (req, res) => {
  try {
    if ("sa" !== req.user.role && "admin" !== req.user.role) return res.json({ success: false });

    await ChatMessage.update(
      { deleted: req.params.delete },
      {
        where: { id: req.params.id }
      }
    );
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
