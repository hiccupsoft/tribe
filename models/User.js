"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.ChatMessage);
      User.belongsTo(models.Platform);
      User.hasMany(models.Content);
      User.hasMany(models.Collection);
    }

    static isCorrectPassword = (inputPassword, dbPassword) =>
      bcrypt.compare(inputPassword, dbPassword);

    static hash = password => bcrypt.hashSync(password, 10);
  }
  User.init(
    {
      // TODO: make required
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      salt: DataTypes.STRING,
      chatModerator: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      role: {
        type: DataTypes.ENUM("free", "basic", "premium", "admin", "sa"),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      photoUrl: DataTypes.STRING,
      // use platformId instead
      platform: {
        type: DataTypes.STRING
      },
      providerId: DataTypes.ENUM("google.com", "facebook.com"),
      providerRawId: DataTypes.STRING,
      providerEmail: DataTypes.STRING,
      providerPhotoUrl: DataTypes.STRING,
      firebase: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      banned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: "User",
      indexes: [
        {
          unique: "EmailPlatformIdComposite",
          fields: ["email", "PlatformId"]
        }
      ]
    }
  );

  return User;
};
