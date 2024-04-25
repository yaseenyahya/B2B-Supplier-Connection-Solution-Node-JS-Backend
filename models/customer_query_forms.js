"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class customer_query_forms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      customer_query_forms.belongsTo(models.users, {
        foreignKey: "id",
        allowNull: false,
      });
    }
  }
  customer_query_forms.init(
    {
      user_id:DataTypes.INTEGER,
      buyer_id:DataTypes.INTEGER,
      company_name: DataTypes.STRING,
      buyer_name: DataTypes.STRING,
      location: DataTypes.STRING,
      country_code: DataTypes.STRING,
      contact_no: DataTypes.STRING,
      source_of_contact: DataTypes.STRING,
      other_platform_text: DataTypes.STRING,
      status_of_query: DataTypes.STRING,
      additional_note: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "customer_query_forms",
    }
  );
  return customer_query_forms;
};
