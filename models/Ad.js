"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ad.belongsTo(models.Platform);
      Ad.belongsToMany(models.Collection, { through: "AdCollection" });
    }
  }
  Ad.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      type: {
        type: DataTypes.ENUM("Image", "Embed", "Embed Large", "Popup Embed"),
        defaultValue: "Image",
        allowNull: false
      },
      embed: DataTypes.TEXT,
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true
        }
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true
        }
      }
    },
    {
      sequelize,
      modelName: "Ad",
      charset: "utf8mb4"
    }
  );
  return Ad;
};
