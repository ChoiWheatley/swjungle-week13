"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _) {
    await queryInterface.removeColumn("Posts", "author");
    await queryInterface.removeColumn("Comments", "author");
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.addColumn("Posts", {
      author: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    });
    await queryInterface.addColumn("Comments", {
      author: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    });
  },
};
