"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Platform extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Platform.hasMany(models.Ad);
      Platform.hasMany(models.Content);
      Platform.hasMany(models.Collection);
      Platform.hasMany(models.User);
      Platform.hasMany(models.Link);
    }
  }
  Platform.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      upgradeBtn: {
        type: DataTypes.STRING,
        allowNull: true
      },
      heroImage: {
        type: DataTypes.STRING,
        allowNull: true
      },
      heroTextColor: {
        type: DataTypes.STRING,
        allowNull: true
      },
      primaryColor: {
        type: DataTypes.STRING,
        allowNull: true
      },
      secondaryColor: {
        type: DataTypes.STRING,
        allowNull: true
      },
      darkColor: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lightColor: {
        type: DataTypes.STRING,
        allowNull: true
      },
      heroImgOnly: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      fathomAnalytics: {
        type: DataTypes.STRING,
        allowNull: true
      },
      homepageUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      upgradeUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      premiumToken: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      basicToken: {
        type: DataTypes.TEXT,
        allowNull: true
      }
      //liveChannelURL: { type: DataTypes.STRING, allowNull: false },
      //signInMethods: google and/or/nor facebook,
      //navLinks array of textlabel, url, new window?
      //extraCSS
    },
    {
      sequelize,
      modelName: "Platform"
    }
  );
  return Platform;
};
