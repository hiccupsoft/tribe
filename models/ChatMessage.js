"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChatMessage extends Model {
    static associate(models) {
      ChatMessage.belongsTo(models.Content);
      ChatMessage.belongsTo(models.User); // author
    }
  }
  ChatMessage.init(
    {
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
      /*
      postedTimestamp: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      }
      */
    },
    {
      sequelize,
      modelName: "ChatMessage"
    }
  );
  return ChatMessage;
};
