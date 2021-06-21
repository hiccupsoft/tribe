const { Collection } = require("../models/index");
const { Platform } = require("../models/index");
const { Content } = require("../models/index");
const { User } = require("../models/index");
const { Ad } = require("../models/index");

exports.readMany = async (req, res) => {
  try {
    //let { currentPage, itemsPerPage } = req.query;

    where = {};

    if ("sa" !== req.user.role) {
      where = {
        ...where,
        PlatformId: req.user.PlatformId
      };
    }

    const collections = await Collection.findAll({
      where,
      order: [["position", "ASC"]],
      include: [Platform]
    });
    res.json(collections);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.upsert = async (req, res) => {
  try {
    let instance;
    if (req.body.id) {
      await Collection.update(req.body, {
        where: { id: req.body.id }
      });
      instance = await Collection.findByPk(req.body.id, {
        include: [Platform]
      });
      return res.json([instance, false]);
    } else {
      const newInstance = await Collection.create(req.body);
      instance = await Collection.findByPk(newInstance.id, {
        include: [Platform]
      });
      return res.json([instance, true]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.delete = async (req, res) => {
  try {
    const instance = await Collection.findByPk(req.params.id);
    await instance.destroy();
    res.json();
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.getCollectionByPlatform = async (req, res) => {
  try {
    const collections = await Collection.findAll({
      order: [["createdAt", "DESC"]],
      include: [{ model: Platform }, { model: Content, include: User }, { model: Ad }],
      where: { PlatformId: req.params.PlatformId }
    });
    res.json(collections);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
