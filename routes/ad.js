const { Ad } = require("../models/index");
const { Collection } = require("../models/index");

exports.readMany = async (req, res) => {
  try {
    where = {};

    if ("sa" !== req.user.role) {
      where = {
        ...where,
        PlatformId: req.user.PlatformId
      };
    }

    //let { currentPage, itemsPerPage } = req.query;
    const ads = await Ad.findAll({
      where,
      order: [["createdAt", "DESC"]],
      include: [Collection]
    });
    res.json(ads);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.upsert = async (req, res) => {
  try {
    let instance;
    if (req.body.id) {
      await Ad.update(req.body, {
        where: { id: req.body.id }
      });
      // set collection array
      instance = await Ad.findByPk(req.body.id);
      await instance.setCollections(req.body.CollectionIds);
      // send
      return res.json([req.body, false]);
    } else {
      instance = await Ad.create(req.body);
      // set collection array
      await instance.setCollections(req.body.CollectionIds);
      // send
      instance = await Ad.findByPk(instance.id, { include: Collection });
      return res.json([instance, true]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.delete = async (req, res) => {
  try {
    const instance = await Ad.findByPk(req.params.id);
    await instance.destroy();
    res.json();
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
