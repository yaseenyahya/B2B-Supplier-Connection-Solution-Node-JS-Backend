'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class b_categories extends Model {
    
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      b_categories.belongsTo(models.a_categories, {
        foreignKey: "a_category_id",
        allowNull: false,
      });
    }
  }
  b_categories.init({
    name: DataTypes.STRING,
    a_category_id:DataTypes.INTEGER,
    tempid: DataTypes.STRING,
    media:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'b_categories',
  });
  return b_categories;
};