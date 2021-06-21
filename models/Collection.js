"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Collection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Collection.belongsTo(models.Platform);
      Collection.belongsTo(models.User); // author
      //Collection.hasMany(models.Content);
      Collection.belongsToMany(models.Content, {
        through: "ContentCollection"
      });
      Collection.belongsToMany(models.Ad, {
        through: "AdCollection"
      });
    }
  }
  Collection.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      description: DataTypes.TEXT,
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      collectionBGImage: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true
        }
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          notEmpty: true
        }
      }
    },
    {
      sequelize,
      modelName: "Collection"
    }
  );
  return Collection;
};
