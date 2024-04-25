"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("customer_query_forms", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', 
          key: 'id', 
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      buyer_id:{
        type: Sequelize.INTEGER,
        allowNulls: true,
      },
      company_name: {
        type: Sequelize.STRING,
        allowNulls: false,
      },
      buyer_name: {
        type: Sequelize.STRING,
        allowNulls: false,
      },
      location: {
        type: Sequelize.STRING,
        allowNulls: false,
      },
      country_code: {
        type: Sequelize.STRING,
        allowNulls: false,
      },
      contact_no: {
        type: Sequelize.STRING,
        allowNulls: false,
      },
      source_of_contact: {
        type: Sequelize.STRING,
        allowNulls: false,
      },
      other_platform_text: {
        type: Sequelize.STRING,
        allowNulls: true,
      }, 
      status_of_query: {
        type: Sequelize.STRING,
        allowNulls: true,
      },
      additional_note: {
        type: Sequelize.STRING,
        allowNulls: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("customer_query_forms");
  },
};
