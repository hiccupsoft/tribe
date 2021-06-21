"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Content extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Content.belongsTo(models.Platform);
      Content.hasMany(models.ChatMessage);
      Content.belongsToMany(models.Collection, {
        through: "ContentCollection"
      });
      Content.belongsTo(models.User);
    }
  }
  Content.init(
    {
      title: {
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
      description: DataTypes.TEXT,
      /*content: {
        type: DataTypes.STRING,
        allowNull: false,
      },*/
      featuredImage: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: false
        }
      },
      type: {
        type: DataTypes.ENUM(
          "jw video",
          "video embed",
          "jw live channel",
          "resi",
          "video"
          //"audio",
          //"live event",
          //"article",
          //"link or download"
        ),
        allowNull: false
      },
      contentURI: {
        type: DataTypes.STRING
      }, // if type = "videoId" or "audioId",
      video: {
        type: DataTypes.STRING
      }, // if type = "video"
      chatEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      //linkOrDownloadUrl: DataTypes.STRING, // if type = "link or download"
      visibility: {
        type: DataTypes.ENUM("public", "free", "basic", "premium"),
        allowNull: false
      },
      expireDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      publishedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
      }
    },
    {
      sequelize,
      modelName: "Content"
    }
  );
  return Content;
};
