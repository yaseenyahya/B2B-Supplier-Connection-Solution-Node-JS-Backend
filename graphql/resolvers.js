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
const { generateRandomNumber } = require("./includes");
const pubsub = new RedisPubSub({
  connection: otherConfig.REDIS_URL,
});
//const pubsub = new RedisPubSub({
// connection: otherConfig.REDIS_URL,
//});
const CUSTOMER_QUERY_FORMS_ADDED = "CUSTOMER_QUERY_FORMS_ADDED";
module.exports = {
  Subscription: {
    customerqueryformsadded: {
      subscribe: () => pubsub.asyncIterator(CUSTOMER_QUERY_FORMS_ADDED),
    },
  },
  Query: {
    get_products_by_user_id: async (parent, args, { res, resolver }) => {
      const products = await db.products.findAll({
        where: {
          user_id: args.user_id,
        },
        order: [["id", "DESC"]],
      });

      return products;
    },
    get_a_categories: async (parent, args, { res, resolver }) => {
      const A_categories = await db.a_categories.findAll({
        order: [["name", "ASC"]],
      });
      return A_categories;
    },
    get_b_categories: async (parent, args, { res, resolver }) => {
      const B_categories = await db.b_categories.findAll({
        where: {
          a_category_id: args.a_category_id,
        },
        order: [["name", "ASC"]],
      });
      return B_categories;
    },
    get_c_categories: async (parent, args, { res, resolver }) => {
      const C_categories = await db.c_categories.findAll({
        where: {
          b_category_id: args.b_category_id,
        },
        order: [["name", "ASC"]],
      });
      return C_categories;
    },
    get_all_customer_query_forms_by_user_id: async (
      parent,
      args,
      { res, resolver }
    ) => {
      const customer_query_forms = await db.customer_query_forms.findAll({
        where: {
          user_id: args.user_id,
        },
        raw: true,
        order: [["id", "DESC"]],
      });

      return customer_query_forms;
    },
  },
  RoleType: {
    Admin: "Admin",
    Vendor: "Vendor",
    Buyer: "Buyer",
  },

  Mutation: {
    login: async (parent, args, { res, resolver }) => {
      let me = null;
      let user = await db.users.findOne({
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
      let user = await db.users.findOne({
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
    check_email_user_exist: async (parent, args, { res, resolver }) => {
      let user = await db.users.findOne({
        where: {
          email: args.email,
        },
      });

      return {
        success: true,
        error: null,
        result: user != null,
      };
    },
    register: async (parent, args, { res, resolver }) => {
      let user = await db.users.create({
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
      let user = await db.users.findOne({
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
        result: args.category_a_id,
      };
    },
    submit_contact_us: async (parent, args, { res, resolver }) => {
      let userData = await db.users.findOne({
        where: {
          id: args.user_id,
        },
      });
      var emailErrorText = "";
      if (userData) {
        var transport = {
          port: 465,
          host: mailerConfig.HOST,
          secure: true, // e.g. smtp.gmail.com
          tls: {
            rejectUnauthorized: false,
          },
          auth: {
            user: mailerConfig.USERNAME,
            pass: mailerConfig.PASSWORD,
          },
        };

        var userMessage = `${args.message}`;

        userMessage += `<br/><br/><b>From:</b>`;
        userMessage += `<br/>Company Name : ${userData.company_name}`;
        userMessage += `<br/>Contact No : ${userData.contact_no}`;
        userMessage += `<br/>Role : ${userData.role}`;

        try {
          var transporter = nodemailer.createTransport(transport);
          const subject = `${args.subject} (${userData.company_name})`;
          const email = mailerConfig.EMAIL;

          var mail = {
            from: mailerConfig.EMAIL,
            to: email,
            subject: subject,

            html: userMessage,
          };

          try {
            let info = await transporter.sendMail(mail);
          } catch (err) {
            console.log("Email Error Details", err);
            emailErrorText = "Unable to send email. Please contact admin.";
          }
        } catch (e) {
          console.log("Email Error Details 2", err);
        }
      }
      return {
        success: userData != null && emailErrorText == "",
        error: !userData
          ? "Unable to find login user."
          : emailErrorText != ""
          ? emailErrorText
          : null,
      };
    },
    send_email_verification_code: async (parent, args, { res, resolver }) => {
      var transport = {
        port: 465,
        host: mailerConfig.HOST,
        secure: true, // e.g. smtp.gmail.com
        tls: {
          rejectUnauthorized: false,
        },
        auth: {
          user: mailerConfig.USERNAME,
          pass: mailerConfig.PASSWORD,
        },
      };

      var emailErrorText = "";
      var code = generateRandomNumber(6);
      var userMessage = `<b>Verification Code</b><br/>`;
      userMessage += `<br/>Your verification code:<br/>`;
      userMessage += `<br/>${code}<br/>`;
      userMessage += `<br/><i>This is an automated message, please do not reply.</i>`;

      try {
        var transporter = nodemailer.createTransport(transport);
        const subject = `Verification Code (Wareport)`;
        const email = args.email;

        var mail = {
          from: mailerConfig.EMAIL,
          to: email,
          subject: subject,

          html: userMessage,
        };

        try {
          let info = await transporter.sendMail(mail);
        } catch (err) {
          console.log("Email Error Details", err);
          emailErrorText = "Unable to send email. Please contact admin.";
        }
      } catch (e) {
        console.log("Email Error Details 2", err);
      }
      return {
        success: emailErrorText == "",
        error: emailErrorText != "" ? emailErrorText : null,
        result: code,
      };
    },
    update_profile: async (parent, args, { res, resolver }) => {
      let user = await db.users.findOne({
        where: {
          id: args.user_id,
        },
      });

      if (user) {
        user.avatar = args.avatar;
        user.company_name = args.company_name;
        user.country_code = args.country_code;
        user.contact_no = args.contact_no;
        user.contact_no_verified = args.contact_no_verified;
        user.email = args.email;
        user.email_verified = args.email_verified;
        try {
          await user.save();
        } catch (e) {
          console.log(e);
        }
      }
      return user;
    },
    change_password: async (parent, args, { res, resolver }) => {
      let user = await db.users.findOne({
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
      return db.users.findOne({
        where: {
          id: args.id,
        },
      });
    },
    delete_product: async (parent, args, { res, resolver }) => {
      await db.products.destroy({
        where: {
          id: args.product_id,
        },
      });
      return {
        success: true,
        error: null,
      };
    },
    add_product: async (parent, args, { res, resolver }) => {
      let product = await db.products.create({
        user_id: args.user_id,
        category_b_id: args.category_b_id,
        category_c_id: args.category_c_id,
        product_color: args.product_color,
        title: args.title,
        price: args.price,
        discount_quantity: args.discount_quantity,
        discount_price: args.discount_price,
        description: args.description,
        media_serialized: args.media_serialized,
      });

      return product.get({ plain: true });
    },
    edit_product: async (parent, args, { res, resolver }) => {
      let product = await db.products.findOne({
        where: {
          id: args.product_id,
        },
      });

      if (product) {
        product.user_id = args.user_id;
        product.category_b_id = args.category_b_id;
        product.category_c_id = args.category_c_id;
        product.product_color = args.product_color;
        product.title = args.title;
        product.price = args.price;
        product.discount_quantity = args.discount_quantity;
        product.discount_price = args.discount_price;
        product.description = args.description;
        product.media_serialized = args.media_serialized;
        try {
          await product.save();
        } catch (e) {
          console.log(e);
        }
      }
      return {
        success: true,
        error: null,
      };
    },
    add_customer_query_forms: async (parent, args, { res, resolver }) => {
      let emailErrorText = null;
console.log(args);
      try {
        if (args.user_id == undefined) {
          var productIds = JSON.parse(
            args.customerQueryFormProductsSearialized
          ).map((value) => {
            return value.id;
          });
          let productsWithUserId = await db.products.findAll({
            where: { id: productIds },
            attributes: ["id", "user_id"],
            raw: true,
          });
          const groupedByUserVendorId = _.groupBy(
            productsWithUserId,
            (item) => item.user_id
          );
          const userVendorIdsOnly = Object.keys(groupedByUserVendorId);
          const transaction = await db.sequelize.transaction(
            async (transaction) => {
              for (let i = 0; i < userVendorIdsOnly.length; i++) {
                const customer_query_form =
                  await db.customer_query_forms.create(
                    {
                      user_id: userVendorIdsOnly[i],
                      company_name: args.company_name,
                      buyer_id: args.buyer_id,
                      buyer_name: args.buyer_name,
                      location: args.location,
                      country_code: args.country_code,
                      contact_no: args.contact_no,
                      source_of_contact: args.source_of_contact,
                      other_platform_text: args.other_platform_text,
                      status_of_query: args.status_of_query,
                      additional_note: args.additional_note,
                    },
                    { transaction }
                  );
                   JSON.parse(
                    args.customerQueryFormProductsSearialized
                  ).map((value) => {
                    console.log(value)
                  });
                var customerQueryFormProductsUnserialized = JSON.parse(
                  args.customerQueryFormProductsSearialized
                ).map((value) => {
                  return {
                    ["customer_query_form_id"]: customer_query_form.id,
                    ["product_id"]: value.id,
                    ["product_qty"]: value.qty,
                  };
                });

                const customer_query_form_products =
                  await db.customer_query_form_products.bulkCreate(
                    customerQueryFormProductsUnserialized,
                    { transaction }
                  );
              
                const customer_query_forms = await db.customer_query_forms.findAll({
                  where: {
                    user_id: userVendorIdsOnly[i],
                  },
                  raw: true,
                  order: [["id", "DESC"]],
                });

               pubsub.publish(CUSTOMER_QUERY_FORMS_ADDED, {
                  customerqueryformsadded: _.cloneDeep({
                    user_id: userVendorIdsOnly[i],
                 
                    customerQueryForms:customer_query_forms
                  }),
                })
              }
            }
          );
        } else {
          const transaction = await db.sequelize.transaction(
            async (transaction) => {
              const customer_query_form = await db.customer_query_forms.create(
                {
                  user_id: args.user_id,
                  company_name: args.company_name,
                  buyer_name: args.buyer_name,
                  location: args.location,
                  country_code: args.country_code,
                  contact_no: args.contact_no,
                  source_of_contact: args.source_of_contact,
                  other_platform_text: args.other_platform_text,
                  status_of_query: args.status_of_query,
                  additional_note: args.additional_note,
                },
                { transaction }
              );

              var customerQueryFormProductsUnserialized = JSON.parse(
                args.customerQueryFormProductsSearialized
              ).map((value) => {
                return {
                  ["customer_query_form_id"]: customer_query_form.id,
                  ["product_id"]: value,
                };
              });

              const customer_query_form_products =
                await db.customer_query_form_products.bulkCreate(
                  customerQueryFormProductsUnserialized,
                  { transaction }
                );
            }
          );
        }
      } catch (e) {
        //console.log(e)
        emailErrorText = e;
      }
      console.log(emailErrorText)
      return {
        success: emailErrorText == null,
        error: emailErrorText,
      };
    },
  },
  CustomerQueryForms: {
    customerQueryFormProducts(parent) {
      return db.customer_query_form_products.findAll({
        where: {
          customer_query_form_id: parent.id,
        },
      });
    },
  },
};
