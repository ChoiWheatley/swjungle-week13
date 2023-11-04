"use strict";
const { Model } = require("sequelize");
module.exports =
  /**
   *
   * @param {import("sequelize").Sequelize} sequelize
   * @param {import("sequelize").DataTypes} DataTypes
   * @returns {Model} Post Model
   */
  (sequelize, DataTypes) => {
    class Post extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
        // define association here
        /// TODO - author를 User에 대한 FK로 변경
      }
    }
    Post.init(
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
        author: {
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
        modelName: "Post",
      }
    );
    return Post;
  };
