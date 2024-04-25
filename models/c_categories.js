'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class c_categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      c_categories.belongsTo(models.b_categories, {
        foreignKey: "b_category_id",
        allowNull: false,
      });
    }
  }
  c_categories.init({
    name: DataTypes.STRING,
    b_category_id:DataTypes.INTEGER,
    tempid: DataTypes.STRING,
    media:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'c_categories',
  });
  return c_categories;
};