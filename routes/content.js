const { Content } = require("../models/index");
const { Collection } = require("../models/index");

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

    const contents = await Content.findAll({
      where,
      order: [["createdAt", "DESC"]],
      include: [Collection]
    });
    res.json(contents);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.upsert = async (req, res) => {
  try {
    let instance;
    if (req.body.id) {
      await Content.update(req.body, {
        where: { id: req.body.id }
      });
      // set collection array
      instance = await Content.findByPk(req.body.id);
      await instance.setCollections(req.body.CollectionIds);
      // send
      return res.json([req.body, false]);
    } else {
      instance = await Content.create(req.body);
      // set collection array
      await instance.setCollections(req.body.CollectionIds);
      // send
      instance = await Content.findByPk(instance.id, { include: Collection });
      return res.json([instance, true]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.delete = async (req, res) => {
  try {
    const instance = await Content.findByPk(req.params.id);
    await instance.destroy();
    res.json();
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
