'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class a_categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  a_categories.init({
    name: DataTypes.STRING,
    tempid: DataTypes.STRING,
    media:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'a_categories',
  });
  return a_categories;
};