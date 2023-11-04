"use strict";
const { Model } = require("sequelize");

module.exports =
  /**
   *
   * @param {import("sequelize").Sequelize} sequelize - Sequalize
   * @param {import("sequelize").DataTypes} DataTypes - Sequelize Column DataTypes
   * @returns {Model} - Sequelize Model
   */
  (sequelize, DataTypes) => {
    class Posts extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
        // define association here
      }
    }
    Posts.init(
      {
        postId: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        title: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        content: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        password: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: "Posts",
      }
    );
    return Posts;
  };
