const { Platform } = require("../models/index");
const { Collection } = require("../models/index");
const { Link } = require("../models/index");
const { Content } = require("../models/index");
const { User } = require("../models/index");
const { Ad } = require("../models/index");

const jwt = require("jsonwebtoken");

exports.readMany = async (req, res) => {
  try {
    where = {};

    if ("sa" !== req.user.role) {
      where = {
        ...where,
        id: req.user.PlatformId
      };
    }

    //let { currentPage, itemsPerPage } = req.query;
    const platforms = await Platform.findAll({
      where,
      order: [["createdAt", "DESC"]]
    });
    res.json(platforms);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.upsert = async (req, res) => {
  try {
    let instance;
    if (req.body.id) {
      await Platform.update(req.body, {
        where: { id: req.body.id }
      });
      return res.json([req.body, false]);
    } else {
      //Create tokens for premium & basic url.
      const premiumToken = jwt.sign({ role: "basic" }, process.env.SECRET);
      const basicToken = jwt.sign({ role: "premium" }, process.env.SECRET);
      instance = await Platform.create({
        ...req.body,
        basicToken,
        premiumToken
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
    const instance = await Platform.findByPk(req.params.id);
    await instance.destroy();
    res.json();
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

// GET PLATFORM BY SLUG
exports.get = async (req, res) => {
  try {
    const instance = await Platform.findOne({
      where: { slug: req.params.slug },
      include: [
        {
          model: Collection,
          include: [{ model: Platform }, { model: Content, include: User }, { model: Ad }]
        },
        Link
      ],
      order: [["createdAt", "DESC"]]
    });
    res.json(instance);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

// GET PLATFORM BY HOMEPAGE URL

exports.getByHomepageURL = async (req, res) => {
  try {
    const instance = await Platform.findOne({
      where: { homepageUrl: req.params.homepageUrl },
      include: [{ model: User }]
    });
    res.json(instance);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
exports.getAnalytics = async (req, res) => {
  try {
    const platformId = req.params.id;
    const free = await User.count({
      where: {
        PlatformId: platformId,
        role: "free"
      }
    });
    const basic = await User.count({
      where: {
        PlatformId: platformId,
        role: "basic"
      }
    });
    const premium = await User.count({
      where: {
        PlatformId: platformId,
        role: "premium"
      }
    });
    const admin = await User.count({
      where: {
        PlatformId: platformId,
        role: "admin"
      }
    });
    res.json({ free, premium, basic, admin });
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.resetTokens = async (req, res) => {
  try {
    const premiumToken = jwt.sign({ role: "premium" }, process.env.SECRET);
    const basicToken = jwt.sign({ role: "basic" }, process.env.SECRET);
    const instance = await Platform.update(
      { basicToken, premiumToken },
      {
        where: { slug: req.params.slug }
      }
    );
    if (!instance) {
      throw new Error("Platform not found.");
    }
    res.json({ basicToken, premiumToken });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
