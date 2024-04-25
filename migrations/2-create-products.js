'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category_b_id: {
        type: Sequelize.INTEGER,
        allowNulls: false
      },
      category_c_id: {
        type: Sequelize.INTEGER,
        allowNulls: false
      },
      product_color:{
        type: Sequelize.STRING,
        allowNulls: true
      },
      title: {
        type: Sequelize.STRING,
        allowNulls: false
      },  
      price: {
        type: Sequelize.INTEGER,
        allowNulls: true
      },
      discount_quantity: {
        type: Sequelize.INTEGER,
        allowNulls: true
      },
      discount_price: {
        type: Sequelize.INTEGER,
        allowNulls: true
      },
      description: {
        type: Sequelize.STRING,
        allowNulls: true
      },
      media_serialized:{
        type: Sequelize.STRING,
        allowNulls: false
      }, 
      user_id:{
        type: Sequelize.INTEGER,
        references: {
          model: 'users', 
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
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};