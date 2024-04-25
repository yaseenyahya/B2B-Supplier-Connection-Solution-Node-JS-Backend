"use strict";
const { Model } = require("sequelize");
var bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     
    }
  }
  Users.init(
    {
      avatar: DataTypes.TEXT("long"),
      company_name: DataTypes.STRING,
      email: DataTypes.STRING,
      country_code: DataTypes.STRING,
      contact_no: DataTypes.STRING,
      contact_no_verified: DataTypes.INTEGER,
      email_verified: DataTypes.INTEGER,
      role: DataTypes.ENUM("Admin", "Vendor", "Buyer"),
      password: DataTypes.STRING,
      category_a_id: DataTypes.INTEGER,
     
    },
    {
      sequelize,
      hooks: {
        beforeCreate: function (user, options) {

          const salt = bcrypt.genSaltSync();
          user.password = bcrypt.hashSync(user.password, salt);

          user.createdAt = new Date();
          user.updatedAt = new Date();
 
        },
        beforeUpdate: function (user, options) {
          const salt = bcrypt.genSaltSync();
          user.password = bcrypt.hashSync(user.password, salt);

          user.updatedAt = new Date();
          
        },
      },
      modelName: "users",
    }
  );
  return Users;
};
