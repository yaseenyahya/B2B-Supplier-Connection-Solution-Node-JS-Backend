var db = require("../models/index");
var bcrypt = require("bcrypt");
var { AuthenticationError } = require("apollo-server");
var validator = require("validator");
var crypto = require("crypto");
var mailerConfig = require("../config/mailer.json");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const { RedisPubSub } = require("graphql-redis-subscriptions");
const axios = require("axios");
const otherconfig = require("../config/otherconfig.json");
const moment = require("moment");
const env = process.env.NODE_ENV || "development";
const otherConfig = otherconfig[env];
const _ = require("lodash");

//const pubsub = new RedisPubSub({
// connection: otherConfig.REDIS_URL,
//});

module.exports = {
  Query: {},
  RoleType: {
    Admin: "Admin",
    Vendor: "Vendor",
    Buyer: "Buyer",
  },

  Mutation: {
    login: async (parent, args, { res, resolver }) => {
      let me = null;
      let user = await db.Users.findOne({
        where: {
          contact_no: args.contact_no,
        },
      });

      if (user) {
        let valid = bcrypt.compareSync(args.password, user.password);
        if (valid) {
          me = user;
        }
      }

      if (!me)
        throw new AuthenticationError(
          user
            ? "User password is incorrect."
            : "User isn't connected to any account."
        );

      return me;
    },
    check_contact_no_user_exist: async (parent, args, { res, resolver }) => {
      let me = null;
      let user = await db.Users.findOne({
        where: {
          contact_no: args.contact_no,
        },
      });

      return {
        success: true,
        error: null,
        result: user != null,
      };
    },
    register: async (parent, args, { res, resolver }) => {
      let user = await db.Users.create({
        avatar: args.avatar,
        company_name: args.company_name,
        country_code: args.country_code,
        contact_no: args.contact_no,
        contact_no_verified: args.contact_no_verified,
        email: args.email,
        email_verified: args.email_verified,
        role: args.role,
        password: args.password,
        category_a_id: args.category_a_id,
      });

      return user;
    },
    update_category_a_id: async (parent, args, { res, resolver }) => {
      let user = await db.Users.findOne({
        where: {
          id: args.user_id,
        },
      });
      if (user) {
        user.category_a_id = args.category_a_id;
        try {
          await user.save();
        } catch (e) {
          console.log(e);
        }
      }
      return {
        success: true,
        error: null,
      };
    },
    change_password: async (parent, args, { res, resolver }) => {
      let user = await db.Users.findOne({
        where: {
          contact_no: args.contact_no,
        },
      });
 
      if (user) {
        user.password = args.password;
        try {
          await user.save();
        } catch (e) {
          console.log(e);
        }
      }
      return {
        success: true,
        error: null,
      };
    },
    me: (parent, args, { res, resolver }) => {
      return db.Users.findOne({
        where: {
          id: args.id,
        },
      });
    },
  },
};
