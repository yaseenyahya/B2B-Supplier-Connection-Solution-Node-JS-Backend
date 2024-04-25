"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("a_categories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      tempid: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      media: {
        allowNull: true,
        type: Sequelize.STRING,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("a_categories");
  },
};
