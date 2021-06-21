const { Link } = require("../models/index");

exports.readMany = async (req, res) => {
  try {
    where = {};

    if ("sa" !== req.user.role) {
      where = {
        ...where,
        PlatformId: req.user.PlatformId
      };
    }

    const links = await Link.findAll({
      where,
      order: [["createdAt", "DESC"]]
    });
    res.json(links);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.upsert = async (req, res) => {
  try {
    let instance;
    if (req.body.id) {
      await Link.update(req.body, {
        where: { id: req.body.id }
      });
      return res.json([req.body, false]);
    } else {
      instance = await Link.create(req.body);
      return res.json([instance, true]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.delete = async (req, res) => {
  try {
    const instance = await Link.findByPk(req.params.id);
    await instance.destroy();
    res.json();
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
