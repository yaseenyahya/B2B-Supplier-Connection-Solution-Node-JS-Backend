'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customer_query_form_products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      customer_query_form_products.belongsTo(models.customer_query_forms, {
        foreignKey: "customer_query_form_id",
        allowNull: false,
      });
      customer_query_form_products.belongsTo(models.products, {
        foreignKey: "product_id",
        allowNull: false,
      });
   
    }
  }
  customer_query_form_products.init({
    customer_query_form_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,  
    product_qty:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'customer_query_form_products',
  });
  return customer_query_form_products;
};