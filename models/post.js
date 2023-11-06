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
    class Posts extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
        this.hasMany(models.Comments, {
          sourceKey: "postId",
          foreignKey: "PostId",
        });
        this.belongsTo(models.Users, {
          targetKey: "userId",
          foreignKey: "UserId",
        });
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
          type: DataTypes.TEXT,
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
        userId: {
          allowNull: false,
          type: DataTypes.INTEGER,
          references: {
            model: "Users",
            key: "userId",
          },
          onDelete: "CASCADE",
        },
      },
      {
        sequelize,
        modelName: "Posts",
      }
    );
    return Posts;
  };
