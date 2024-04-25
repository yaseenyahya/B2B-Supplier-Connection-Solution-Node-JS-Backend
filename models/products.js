"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      products.belongsTo(models.users, {
        foreignKey: "user_id",
        allowNull: false,
      });
    }
  }
  products.init(
    {
      category_b_id: DataTypes.INTEGER,
      category_c_id: DataTypes.INTEGER,
      product_color:DataTypes.STRING,
      title: DataTypes.STRING,
      price: DataTypes.INTEGER,
      discount_quantity: DataTypes.INTEGER,
      discount_price: DataTypes.INTEGER,
      description: DataTypes.STRING,
      media_serialized: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      hooks: {
        beforeCreate: function (user, options) {
          user.createdAt = new Date();
          user.updatedAt = new Date();
        },
        beforeUpdate: function (user, options) {
          user.updatedAt = new Date();
        },
      },
      modelName: "products",
    }
  );

 
  return products;
};
