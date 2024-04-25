"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      avatar: {
        type: Sequelize.TEXT("long"),
        allowNulls: true,
      },
      company_name: {
        type: Sequelize.STRING,
        allowNulls: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNulls: true,
      },
      country_code: {
        type: Sequelize.STRING,
        allowNulls: false,
      },
      contact_no: {
        type: Sequelize.STRING,
        allowNulls: false,
        unique: {
          args: true,
          msg: "Contact no already in use.",
        },
      },
      contact_no_verified: {
        type: Sequelize.INTEGER,
        allowNulls: false,
      },
      email_verified: {
        type: Sequelize.INTEGER,
        allowNulls: false,
      },
      role: {
        type: Sequelize.ENUM("Admin", "Vendor", "Buyer"),
      },
      password: {
        type: Sequelize.STRING,
        allowNulls: false,
      },
      category_a_id: {
        type: Sequelize.INTEGER,
        allowNulls: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
