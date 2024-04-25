'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('c_categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      b_category_id:{
        type: Sequelize.INTEGER,
        references: {
          model: 'b_categories', 
          key: 'id', 
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('c_categories');
  }
};