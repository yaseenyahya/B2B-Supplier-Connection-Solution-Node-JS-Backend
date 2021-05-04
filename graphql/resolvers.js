var db = require("../database/db");
var bcrypt = require("bcrypt");
var Auth = require("../auth");
var { AuthenticationError } = require("apollo-server");
var {
  verifyTokenWithUserID,
  checkDesignationIdIsNotValid,
  checkManagerIdIsNotValid,
} = require("./helper");
var validator = require("validator");
var crypto = require("crypto");
var mailerConfig = require("../config/mailer.json");
var cors = require("cors");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const { RedisPubSub } = require("graphql-redis-subscriptions");
const axios = require("axios");
const otherconfig = require("../config/otherconfig.json");
const moment = require("moment");
const { printIntrospectionSchema } = require("graphql");
const env = process.env.NODE_ENV || "development";
const otherConfig = otherconfig[env];

const pubsub = new RedisPubSub({
  connection: otherConfig.REDIS_URL,
});

const CHAT_ADDED = "CHAT_ADDED";
module.exports = {
  Subscription: {
    chatdetailadded: {
      subscribe: () => pubsub.asyncIterator(CHAT_ADDED),
    },
  },
  Query: {
    designations: () => {
      return db.designations.findAll();
    },
    designation: (parent, args) => {
      return db.designations.findOne({
        where: {
          id: args.id,
        },
      });
    },
    pages: () => {
      return db.pages.findAll();
    },
    page: (parent, args) => {
      return db.pages.findAll({
        where: {
          id: args.id,
        },
      });
    },
    profiles: () => {
      return db.profiles.findAll();
    },
    profile: (parent, args) => {
      return db.profiles.findOne({
        where: {
          id: args.id,
        },
      });
    },
    users: (parent, args, { req }) => {
      var where = {};

      if (args.managersOnly) {
        where = { managerId: { [Op.ne]: null }, ...where };
      }
      if (where.lenght == 0) {
        where = null;
      }
      return db.users.findAll({ where: where });
    },
    user: (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;
      return db.users.findOne({
        where: {
          id: args.id,
        },
      });
    },
    me: async (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;

      var userData = await db.users.findOne({
        where: {
          id: req.userID,
        },
      });

      var pagesData = await db.pages.findAll();

      var pages = [];

      pagesData.map((result) => {
        pages.push({
          pageId: result.pageId,
          accesstoken: result.accesstoken,
        });
      });

      userData.pagesData = JSON.stringify(pages);

      return userData;
    },

    usersettings: (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;

      return db.users.findOne({
        where: {
          id: req.userID,
          attributes: ["settings"],
        },
      });
    },
    leadform: (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;

      return db.leadforms.findAll({
        where: {
          customerId: args.customerId,
        },
      });
    },
    chatlastdetailsbyid: async (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;
      //moment().utc().add(5, "hours")
      const TODAY_START = new Date().setHours(0, 0, 0, 0);
      const NOW = new Date();
      var customerAndPageIds = await db.chatdetails.findAll({
        attributes: [[db.sequelize.fn("max", db.sequelize.col("id")), "id"]],
        group: ["customerId", "pageId"],
        where: {
          messagetimestamp: {
            // [Op.gt]: TODAY_START,
            [Op.lt]: NOW,
          },
          agentId: req.userID,
        },
        order: [["id", "asc"]],
      });

      if (customerAndPageIds) {
        let ids = customerAndPageIds.map((result) => {
          return result.id;
        });

        return db.chatdetails.findAll({
          where: {
            id: {
              [Op.in]: ids,
            },
          },
          order: [["messagetimestamp", "DESC"]],
        });
      }
    },
    chatdetailsbyagentcutomerpageid: (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;

      return db.chatdetails.findAll({
        where: {
          agentId: req.userID,
          customerId: args.customerId,
          pageId: args.pageId,
        },
      });
    },
    getfollowupbyagentid: async (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;

      var chatFollowUpDetail = await db.chatdetails.findAll({
        where: {
          agentId: req.userID,
          messagetype: "followuplabel",
          read: 0,
        },
      });

      var errorInJson = false;

      var followUpdata = [];

      chatFollowUpDetail.forEach((element) => {
        var textparse = JSON.parse(element.messagetext);
        var dateOfFollowUp = moment(moment.unix(textparse[1] / 1000));
        var CurrentDate = moment();

        if (CurrentDate.diff(dateOfFollowUp) >= 0)
          followUpdata.push({
            id: element.id,
            textJson: element.messagetext,
            pageId: element.pageId,
            customerId: element.customerId,
            read: element.read,
          });
      });
      var result = null;
      try {
        result = JSON.stringify(followUpdata);
      } catch (e) {
        errorInJson = true;
      }

      return {
        success: !errorInJson,
        error: errorInJson ? "Error in JSON." : null,
        result: result,
      };
    },
  },

  Users: {
    designation(parent) {
      return db.designations.findOne({
        where: {
          id: parent.designationId,
        },
      });
    },
    managerId(parent) {
      return db.users.findOne({
        where: {
          id: parent.managerId,
        },
      });
    },
  },
  Me: {
    designation(parent) {
      return db.designations.findOne({
        where: {
          id: parent.designationId,
        },
      });
    },
    managerId(parent) {
      return db.users.findOne({
        where: {
          id: parent.managerId,
        },
      });
    },
  },
  PanelType: {
    SUPERADMIN: 0,
    ADMIN: 1,
    MANAGER: 2,
    AGENT: 3,
    FINANCE: 4,
  },
  StatusType: {
    ACTIVE: 0,
    BLOCKED: 1,
    DEAD: 2,
  },
  Mutation: {
    login: async (parent, args, { res }) => {
      let me = null;
      await db.users
        .findOne({
          where: {
            username: args.username,
          },
        })
        .then(function (user_) {
          if (user_) {
            let valid = bcrypt.compareSync(args.password, user_.password);
            if (valid) {
              me = user_;

              const {
                refreshToken,
                accessToken,
              } = new Auth().createTokensInCookies(me.id, res);

              me.accessToken = accessToken;
              me.refreshToken = refreshToken;
            }
          }
        });

      if (!me) throw new AuthenticationError("Invalid username and password.");
      if (me.status != 0) throw new AuthenticationError("User is not active.");
      return me;
    },
    logout: async (parent, args, { req, res }) => {
      new Auth().removeTokensInCookies(res);
      return {
        success: true,
        error: null,
      };
    },
    updateme: async (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;

      let errorEmptyUsername = false;
      let errorEmptyNewPassword = false;
      let errorEmptyName = false;
      let errorEmail = false;

      var userData = await db.users.findOne({
        where: {
          username: args.username,
          id: args.id,
        },
      });
      if (userData) {
        let valid = bcrypt.compareSync(args.currentpassword, userData.password);
        if (!valid) {
          throw new AuthenticationError("Invalid username and password.");
        } else {
          if (args.username != undefined) {
            userData.username = args.username;
            errorEmptyUsername = validator.isEmpty(args.username);
          }
          if (args.newpassword) {
            userData.password = args.newpassword;
            errorEmptyPassword = validator.isEmpty(args.newpassword);
          }
          if (args.name != undefined) {
            userData.name = args.name;
            errorEmptyName = validator.isEmpty(args.name);
          }
          if (args.email != undefined) {
            userData.email = args.email;
            errorEmail = !validator.isEmail(args.email);
          }

          if (args.pseudonym != undefined) userData.pseudonym = args.pseudonym;
          if (args.picture != undefined) userData.picture = args.picture;
          if (args.number != undefined) userData.number = args.number;
        }

        if (
          !errorEmptyUsername &&
          !errorEmptyNewPassword &&
          !errorEmptyName &&
          !errorEmail
        )
          var errorOnSaveText = false;
        try {
          await userData.save();
        } catch (e) {
          errorOnSaveText = e;
          console.log(e);
        }
      }
      return {
        success:
          !errorEmptyUsername &&
          !errorEmptyNewPassword &&
          !errorEmptyName &&
          !errorEmail &&
          !errorOnSaveText,
        error:
          errorEmptyUsername ||
          errorEmptyNewPassword ||
          errorEmptyName ||
          errorEmail
            ? "Email is not valid."
            : errorOnSaveText
            ? errorOnSaveText
            : null,
      };
    },
    addpages: async (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;
      if (args.objects && args.objects.length > 0) {
        try {
          await db.pages.bulkCreate(args.objects);
        } catch (e) {
          console.log(e);
        }
      }
      return {
        success: true,
        error: null,
      };
    },
    deletepage: async (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;

      await db.pages.destroy({
        where: {
          id: args.id,
        },
      });

      return {
        success: true,
        error: null,
      };
    },
    getofflinechatdetailanddeleteall: async (parent, args) => {
      var result = await db.offlinechatdetails.findAll();

      db.offlinechatdetails.destroy({ truncate: true });

      return result;
    },
    addofflinechatdetail: async (parent, args) => {
      //  req.userID = verifyTokenWithUserID(args, req);
      // if (req.userID == null) return null;

      let errorEmptyCustomerId = false;
      let errorEmptyPageId = false;
      let errorEmptyMessageText = false;
      let errorEmptMessageTimestamp = false;
      let errorEmptyMessageType = false;

      errorEmptyCustomerId = validator.isEmpty(args.customerId);
      errorEmptyPageId = validator.isEmpty(args.pageId);
      errorEmptyMessageText = validator.isEmpty(args.messagetext);
      //errorEmptMessageTimestamp = validator.isEmpty(args.messagetimestamp);
      errorEmptyMessageType = validator.isEmpty(args.messagetype);

      if (
        !errorEmptyCustomerId &&
        !errorEmptyPageId &&
        !errorEmptyMessageText &&
        !errorEmptMessageTimestamp &&
        !errorEmptyMessageType 
  
      ) {
        var insertData = {
          customerId: args.customerId,
          pageId: args.pageId,
          messageId: args.messageId,
          messagetext: args.messagetext,
          messagetimestamp: isNaN(parseInt(args.messagetimestamp))
            ? args.messagetimestamp
            : parseInt(args.messagetimestamp),
          messagetype: args.messagetype,
        };
        await db.offlinechatdetails.create(insertData);
      }
      return {
        success:
          !errorEmptyCustomerId &&
          !errorEmptyPageId &&
          !errorEmptyMessageText &&
          !errorEmptMessageTimestamp &&
          !errorEmptyMessageType,
        error:
          errorEmptyCustomerId ||
          errorEmptyPageId ||
          errorEmptyMessageText ||
          errorEmptMessageTimestamp ||
          errorEmptyMessageType
            ? "String can not be empty."
            : null,
      };
    },
    addchatdetail: async (parent, args) => {
      //  req.userID = verifyTokenWithUserID(args, req);
      // if (req.userID == null) return null;

      let errorEmptyCustomerId = false;
      let errorEmptyPageId = false;
      let errorEmptyMessageText = false;
      let errorEmptMessageTimestamp = false;
      let errorEmptyMessageType = false;
      let errorEmptyAgentId = false;

      errorEmptyCustomerId = validator.isEmpty(args.customerId);
      errorEmptyPageId = validator.isEmpty(args.pageId);
      errorEmptyMessageText = validator.isEmpty(args.messagetext);
      //errorEmptMessageTimestamp = validator.isEmpty(args.messagetimestamp);
      errorEmptyMessageType = validator.isEmpty(args.messagetype);
      errorEmptyAgentId = validator.isEmpty(args.agentId.toString());

      if (
        !errorEmptyCustomerId &&
        !errorEmptyPageId &&
        !errorEmptyMessageText &&
        !errorEmptMessageTimestamp &&
        !errorEmptyMessageType &&
        !errorEmptyAgentId
      ) {
        var insertData = {
          customerId: args.customerId,
          pageId: args.pageId,
          messageId: args.messageId,
          messagetext: args.messagetext,
          messagetimestamp: isNaN(parseInt(args.messagetimestamp))
            ? args.messagetimestamp
            : parseInt(args.messagetimestamp),
          messagetype: args.messagetype,
          agentId: args.agentId,
          alternateagentId: args.alternateagentId,
        };
        var result = await db.chatdetails.create(insertData);
        insertData.id = result.id;
        pubsub.publish(CHAT_ADDED, { chatdetailadded: insertData });
      }
      return {
        success:
          !errorEmptyCustomerId &&
          !errorEmptyPageId &&
          !errorEmptyMessageText &&
          !errorEmptMessageTimestamp &&
          !errorEmptyMessageType &&
          !errorEmptyAgentId,
        error:
          errorEmptyCustomerId ||
          errorEmptyPageId ||
          errorEmptyMessageText ||
          errorEmptMessageTimestamp ||
          errorEmptyMessageType ||
          errorEmptyAgentId
            ? "String can not be empty."
            : null,
      };
    },
    adduser: async (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;

      let errorEmptyUsername = false;
      let errorEmptyPassword = false;
      let errorEmptyName = false;
      let errorEmptyDesignationId = false;
      let errorEmptyStatus = false;
      let errorDesignationId = false;
      let errorManagerId = false;
      let errorEmail = false;

      errorEmptyUsername = validator.isEmpty(args.username);
      errorEmptyPassword = validator.isEmpty(args.password);
      errorEmptyName = validator.isEmpty(args.name);
      errorEmptyDesignationId = validator.isEmpty(args.designationId);
      errorEmptyStatus = validator.isEmpty(args.status);

      if (args.email) {
        errorEmail = !validator.isEmail(args.email);
      }

      if (args.designationId) {
        errorDesignationId = await checkDesignationIdIsNotValid(
          db,
          args.designationId
        );
      }

      if (args.managerId) {
        errorManagerId = await checkManagerIdIsNotValid(db, args.managerId);
      }
      if (
        !errorEmptyUsername &&
        !errorEmptyPassword &&
        !errorEmptyName &&
        !errorEmptyDesignationId &&
        !errorEmptyStatus &&
        !errorDesignationId &&
        !errorManagerId &&
        !errorEmail
      ) {
        await db.users.create({
          picture: args.picture,
          pseudonym: args.pseudonym,
          username: args.username,
          password: args.password,
          name: args.name,
          email: args.email,
          number: args.number,
          status: args.status,
          comments: args.comments,
          designationId: args.designationId,
          managerId: args.managerId,
          settings: args.settings,
        });
      }
      return {
        success:
          !errorEmptyUsername &&
          !errorEmptyPassword &&
          !errorEmptyName &&
          !errorEmptyDesignationId &&
          !errorEmptyStatus &&
          !errorDesignationId &&
          !errorManagerId,
        error:
          errorEmptyUsername ||
          errorEmptyPassword ||
          errorEmptyName ||
          errorEmptyDesignationId ||
          errorEmptyStatus
            ? "String can not be empty."
            : errorEmail
            ? "Email is not valid."
            : errorDesignationId
            ? "Invalid designation id"
            : errorManagerId
            ? "Invalid manager id"
            : null,
      };
    },
    updateuser: async (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;

      let userData = await db.users.findOne({
        where: {
          id: args.id,
        },
      });
      let errorEmptyUsername = false;
      let errorEmptyPassword = false;
      let errorEmptyName = false;
      let errorEmptyDesignationId = false;
      let errorEmptyStatus = false;
      let errorDesignationId = false;
      let errorManagerId = false;
      let errorEmail = false;

      if (userData) {
        if (args.username != undefined) {
          userData.username = args.username;
          errorEmptyUsername = validator.isEmpty(args.username);
        }
        if (args.password) {
          userData.password = args.password;
          errorEmptyPassword = validator.isEmpty(args.password);
        }
        if (args.name != undefined) {
          userData.name = args.name;
          errorEmptyName = validator.isEmpty(args.name);
        }
        if (args.status != undefined) {
          userData.status = args.status;
          errorEmptyStatus = validator.isEmpty(args.status);
        }
        if (args.email != undefined) {
          userData.email = args.email;
          errorEmail = !validator.isEmail(args.email);
        }
        if (args.designationId != undefined) {
          userData.designationId = args.designationId;
          errorEmptyDesignationId = validator.isEmpty(args.designationId);
        }
        if (args.designationId != undefined) {
          userData.designationId = args.designationId;
          errorDesignationId = await checkDesignationIdIsNotValid(
            db,
            args.designationId
          );
        }
        if (args.managerId != undefined) {
          userData.managerId = args.managerId;
          errorManagerId = await checkManagerIdIsNotValid(db, args.managerId);
        }
        if (args.pseudonym != undefined) userData.pseudonym = args.pseudonym;
        if (args.picture != undefined) userData.picture = args.picture;
        if (args.number != undefined) userData.number = args.number;
        if (args.comments != undefined) userData.comments = args.comments;
        if (args.settings != undefined) userData.settings = args.settings;

        if (
          !errorEmptyUsername &&
          !errorEmptyPassword &&
          !errorEmptyName &&
          !errorEmptyDesignationId &&
          !errorEmptyStatus &&
          !errorDesignationId &&
          !errorManagerId &&
          !errorEmail
        )
          var errorOnSaveText = false;
        try {
          await userData.save();
        } catch (e) {
          errorOnSaveText = e;
          console.log(e);
        }
      }
      return {
        success:
          !errorEmptyUsername &&
          !errorEmptyPassword &&
          !errorEmptyName &&
          !errorEmptyDesignationId &&
          !errorEmptyStatus &&
          !errorDesignationId &&
          !errorManagerId &&
          !errorEmail &&
          !errorOnSaveText,
        error:
          errorEmptyUsername ||
          errorEmptyPassword ||
          errorEmptyName ||
          errorEmptyDesignationId ||
          errorEmptyStatus
            ? "String can not be empty."
            : errorEmail
            ? "Email is not valid."
            : errorDesignationId
            ? "Invalid designation id"
            : errorManagerId
            ? "Invalid manager id"
            : errorOnSaveText
            ? errorOnSaveText
            : null,
      };
    },
    updatelabels: async (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;

      let userData = await db.users.findOne({
        where: {
          id: req.userID,
        },
      });
      let errorEmptyLabel = false;

      if (userData) {
        if (args.labels != undefined) {
          userData.labels = args.labels;
          errorEmptyLabel = validator.isEmpty(args.labels);
        }

        if (!errorEmptyLabel) {
          var errorOnSaveText = false;
          try {
            await userData.save();
          } catch (e) {
            errorOnSaveText = e;
            console.log(e);
          }
        }
      }
      return {
        success: !errorEmptyLabel,
        error: errorEmptyLabel
          ? "String can not be empty."
          : errorOnSaveText
          ? errorOnSaveText
          : null,
      };
    },
    deleteuser: async (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;

      let isCurrentUser = false;
      if (req.userID != args.id) {
        await db.users.destroy({
          where: {
            id: args.id,
          },
        });
      } else {
        isCurrentUser = true;
      }
      return {
        success: !isCurrentUser,
        error: isCurrentUser ? "Cannot delete loggedin user" : null,
      };
    },
    deleteprofile: async (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;

      await db.profiles.destroy({
        where: {
          id: args.id,
        },
      });

      return {
        success: 1,
        error: null,
      };
    },
    addprofile: async (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;

      let errorEmptyName = false;
      let errorEmptyPaneltype = false;

      errorEmptyName = validator.isEmpty(args.name);
      errorEmptyPaneltype = validator.isEmpty(args.paneltype);

      if (!errorEmptyName && !errorEmptyPaneltype) {
        await db.profiles.create({
          name: args.name,
          paneltype: args.paneltype,
          settings: args.settings,
        });
      }
      return {
        success: !errorEmptyName && !errorEmptyPaneltype,
        error:
          errorEmptyName || errorEmptyPaneltype
            ? "String can not be empty."
            : null,
      };
    },
    addchattofacebook: async (parent, args, { req }) => {
      let errorEmptyCustomerId = false;
      let errorEmptyPageId = false;
      let errorEmptyMessage = false;
      let errorEmptyOutgoingMessageId = false;

      errorEmptyCustomerId = validator.isEmpty(args.customerId);
      errorEmptyPageId = validator.isEmpty(args.pageId);
      errorEmptyMessage = validator.isEmpty(args.message);

      var errorMessageFromFaebook = "";

      if (!errorEmptyCustomerId && !errorEmptyPageId && !errorEmptyMessage) {
        const qs = {
          access_token: args.accesstoken,
          messaging_type: "RESPONSE",
          recipient: {
            id: args.customerId,
          },
          message: {
            text: args.message,
          },
        };

        var result;
        try {
          const response = await axios.post(
            "https://graph.facebook.com/v10.0/me/messages",
            qs
          );
          result = response.data;
        } catch (error) {
          if (error.response.data.error.code == 10)
            errorMessageFromFaebook =
              "According to Facebook policy you are not allowed to respond on messages after 24 hours.";
          else errorMessageFromFaebook = error.response.data.error.message;
        }
      }

      return {
        success:
          !errorEmptyCustomerId &&
          !errorEmptyPageId &&
          !errorEmptyMessage &&
          !errorMessageFromFaebook,
        error:
          errorEmptyCustomerId || errorEmptyPageId || errorEmptyMessage
            ? "String can not be empty."
            : errorMessageFromFaebook != ""
            ? errorMessageFromFaebook
            : null,
        result: JSON.stringify({
          outgoingMessageId: args.outgoingMessageId,
          message_id: result ? result.message_id : null,
        }),
      };
    },
    updateprofile: async (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;

      let profileData = await db.profiles.findOne({
        where: {
          id: args.id,
        },
      });
      let errorEmptyName = false;
      let errorEmptyPaneltype = false;

      if (profileData) {
        if (args.name != undefined) {
          profileData.name = args.name;

          errorEmptyName = validator.isEmpty(args.name);
        }
        if (args.paneltype) {
          profileData.paneltype = args.paneltype;
          errorEmptyPaneltype = validator.isEmpty(args.paneltype);
        }
        if (args.settings != undefined) profileData.settings = args.settings;

        if (!errorEmptyName && !errorEmptyPaneltype)
          var errorOnSaveText = false;
        try {
          await profileData.save();
        } catch (e) {
          errorOnSaveText = e;
          console.log(e);
        }
      }
      return {
        success: !errorEmptyName && !errorEmptyPaneltype && !errorOnSaveText,
        error:
          errorEmptyName || errorEmptyPaneltype
            ? "String can not be empty."
            : errorOnSaveText
            ? errorOnSaveText
            : null,
      };
    },
    addleadform: async (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;
      let errorEmptyCustomerId = false;
      let errorEmptyFirstName = false;
      let errorEmptyLastName = false;
      let errorEmptyPhoneNumber = false;
      let errorEmptyCurrentAddress = false;
      let errorEmptyDateOfBirth = false;
      let errorEmptyService = false;
      let errorEmptyReferenceNumber = false;
      let errorEmptyAccountNumber = false;
      let errorEmptyMonthlyTotal = false;
      let errorEmptyFirstMonthBill = false;

      errorEmptyCustomerId = validator.isEmpty(args.customerId);
      errorEmptyFirstName = validator.isEmpty(args.firstname);
      errorEmptyLastName = validator.isEmpty(args.lastname);
      errorEmptyPhoneNumber = validator.isEmpty(args.phonenumber);
      errorEmptyCurrentAddress = validator.isEmpty(args.currentaddress);
      errorEmptyDateOfBirth = validator.isEmpty(args.dateofbirth);

      errorEmptyService = validator.isEmpty(args.service);
      errorEmptyReferenceNumber = validator.isEmpty(args.referencenumber);
      errorEmptyAccountNumber = validator.isEmpty(args.accountnumber);
      errorEmptyMonthlyTotal = validator.isEmpty(args.monthlytotal);
      errorEmptyFirstMonthBill = validator.isEmpty(args.firstmonthbill);

      if (
        !errorEmptyCustomerId &&
        !errorEmptyFirstName &&
        !errorEmptyLastName &&
        !errorEmptyPhoneNumber &&
        !errorEmptyCurrentAddress &&
        !errorEmptyDateOfBirth &&
        !errorEmptyService &&
        !errorEmptyReferenceNumber &&
        !errorEmptyAccountNumber &&
        !errorEmptyMonthlyTotal &&
        !errorEmptyFirstMonthBill
      ) {
        await db.leadforms.create({
          customerId: args.customerId,
          firstname: args.firstname,
          lastname: args.lastname,
          phonenumber: args.phonenumber,
          alternatephonenumber: args.alternatephonenumber,
          emailaddress: args.emailaddress,
          previousaddress: args.previousaddress,
          currentaddress: args.currentaddress,
          dateofbirth: args.dateofbirth,
          ssn: args.ssn,
          provider: args.provider,
          service: args.service,
          referencenumber: args.referencenumber,
          accountnumber: args.accountnumber,
          monthlytotal: args.monthlytotal,
          firstmonthbill: args.firstmonthbill,
          comments: args.comments,
        });
      }
      return {
        success:
          !errorEmptyCustomerId &&
          !errorEmptyFirstName &&
          !errorEmptyLastName &&
          !errorEmptyPhoneNumber &&
          !errorEmptyCurrentAddress &&
          !errorEmptyDateOfBirth &&
          !errorEmptyService &&
          !errorEmptyReferenceNumber &&
          !errorEmptyAccountNumber &&
          !errorEmptyMonthlyTotal &&
          !errorEmptyFirstMonthBill,
        error:
          errorEmptyCustomerId ||
          errorEmptyFirstName ||
          errorEmptyLastName ||
          errorEmptyPhoneNumber ||
          errorEmptyCurrentAddress ||
          errorEmptyDateOfBirth ||
          errorEmptyService ||
          errorEmptyReferenceNumber ||
          errorEmptyAccountNumber ||
          errorEmptyMonthlyTotal ||
          errorEmptyFirstMonthBill
            ? "String can not be empty."
            : null,
      };
    },
    markreadchat: async (parent, args, { req }) => {
      let chatData = await db.chatdetails.findOne({
        where: {
          id: args.id,
        },
      });
      var errorOnSaveText = "";
      if (chatData) {
        chatData.read = 1;
        try {
          await chatData.save();
        } catch (e) {
          errorOnSaveText = e;
          console.log(e);
        }
      }

      return {
        success: !errorOnSaveText,
        error: errorOnSaveText ? errorOnSaveText : null,
      };
    },
    updateleadform: async (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;

      let leadFormsData = await db.leadforms.findOne({
        where: {
          id: args.id,
        },
      });
      let errorEmptyFirstName = false;
      let errorEmptyLastName = false;
      let errorEmptyPhoneNumber = false;
      let errorEmptyCurrentAddress = false;
      let errorEmptyDateOfBirth = false;

      let errorEmptyService = false;
      let errorEmptyReferenceNumber = false;
      let errorEmptyAccountNumber = false;
      let errorEmptyMonthlyTotal = false;
      let errorEmptyFirstMonthBill = false;

      if (leadFormsData) {
        if (args.firstname != undefined) {
          leadFormsData.firstname = args.firstname;
          errorEmptyFirstName = validator.isEmpty(args.firstname);
        }
        if (args.lastname) {
          leadFormsData.lastname = args.lastname;
          errorEmptyLastName = validator.isEmpty(args.lastname);
        }
        if (args.phonenumber != undefined) {
          leadFormsData.phonenumber = args.phonenumber;
          errorEmptyPhoneNumber = validator.isEmpty(args.phonenumber);
        }

        if (args.alternatephonenumber != undefined)
          leadFormsData.alternatephonenumber = args.alternatephonenumber;

        if (args.emailaddress != undefined)
          leadFormsData.emailaddress = args.emailaddress;

        if (args.previousaddress != undefined)
          leadFormsData.previousaddress = args.previousaddress;

        if (args.currentaddress != undefined) {
          leadFormsData.currentaddress = args.currentaddress;
          errorEmptyCurrentAddress = validator.isEmpty(args.currentaddress);
        }
        if (args.dateofbirth != undefined) {
          leadFormsData.dateofbirth = args.dateofbirth;
          errorEmptyDateOfBirth = validator.isEmail(args.dateofbirth);
        }
        if (args.ssn != undefined) {
          leadFormsData.ssn = args.ssn;
        }
        if (args.ssn != undefined) {
          leadFormsData.provider = args.provider;
        }
        if (args.service != undefined) {
          leadFormsData.service = args.service;
          errorEmptySSN = validator.isEmpty(args.service);
        }
        if (args.referencenumber != undefined) {
          leadFormsData.referencenumber = args.referencenumber;
          errorEmptyReferenceNumber = validator.isEmpty(args.referencenumber);
        }
        if (args.accountnumber != undefined) {
          leadFormsData.accountnumber = args.accountnumber;
          errorEmptyAccountNumber = validator.isEmpty(args.accountnumber);
        }
        if (args.monthlytotal != undefined) {
          leadFormsData.monthlytotal = args.monthlytotal;
          errorEmptyMonthlyTotal = validator.isEmpty(args.monthlytotal);
        }
        if (args.firstmonthbill != undefined) {
          leadFormsData.firstmonthbill = args.firstmonthbill;
          errorEmptyFirstMonthBill = validator.isEmpty(args.firstmonthbill);
        }
        if (args.comments != undefined) leadFormsData.comments = args.comments;

        if (
          !errorEmptyFirstName &&
          !errorEmptyLastName &&
          !errorEmptyPhoneNumber &&
          !errorEmptyCurrentAddress &&
          !errorEmptyDateOfBirth &&
          !errorEmptyService &&
          !errorEmptyReferenceNumber &&
          !errorEmptyAccountNumber &&
          !errorEmptyMonthlyTotal &&
          !errorEmptyFirstMonthBill
        )
          var errorOnSaveText = false;
        try {
          await leadFormsData.save();
        } catch (e) {
          errorOnSaveText = e;
          console.log(e);
        }
      }
      return {
        success:
          !errorEmptyFirstName &&
          !errorEmptyLastName &&
          !errorEmptyPhoneNumber &&
          !errorEmptyCurrentAddress &&
          !errorEmptyDateOfBirth &&
          !errorEmptyService &&
          !errorEmptyReferenceNumber &&
          !errorEmptyAccountNumber &&
          !errorEmptyMonthlyTotal &&
          !errorEmptyFirstMonthBill &&
          !errorOnSaveText,
        error:
          errorEmptyFirstName ||
          errorEmptyLastName ||
          errorEmptyPhoneNumber ||
          errorEmptyCurrentAddress ||
          errorEmptyDateOfBirth ||
          errorEmptyService ||
          errorEmptyReferenceNumber ||
          errorEmptyAccountNumber ||
          errorEmptyMonthlyTotal ||
          errorEmptyFirstMonthBill
            ? "String can not be empty."
            : errorOnSaveText
            ? errorOnSaveText
            : null,
      };
    },
    deleteleadform: async (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;

      await db.leadforms.destroy({
        where: {
          id: args.id,
        },
      });

      return {
        success: true,
        error: null,
      };
    },
    adddesignation: async (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;

      let errorEmptyName = false;
      let errorEmptyPaneltype = false;

      errorEmptyName = validator.isEmpty(args.name);
      errorEmptyPaneltype = validator.isEmpty(args.paneltype);

      if (!errorEmptyName && !errorEmptyPaneltype) {
        await db.designations.create({
          name: args.name,
          paneltype: args.paneltype,
        });
      }
      return {
        success: !errorEmptyName && !errorEmptyPaneltype,
        error:
          errorEmptyName || errorEmptyPaneltype
            ? "String can not be empty."
            : null,
      };
    },
    updatedesignation: async (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;

      let designationData = await db.designations.findOne({
        where: {
          id: args.id,
        },
      });
      let errorEmptyName = false;
      let errorEmptyPaneltype = false;

      if (designationData) {
        if (args.name != undefined) {
          designationData.name = args.name;
          errorEmptyName = validator.isEmpty(args.name);
        }
        if (args.paneltype) {
          designationData.paneltype = args.paneltype;
          errorEmptyPaneltype = validator.isEmpty(args.paneltype);
        }

        if (!errorEmptyName && !errorEmptyPaneltype)
          var errorOnSaveText = false;
        try {
          await designationData.save();
        } catch (e) {
          errorOnSaveText = e;
          console.log(e);
        }
      }
      return {
        success: !errorEmptyName && !errorEmptyPaneltype && !errorOnSaveText,
        error:
          errorEmptyName || errorEmptyPaneltype
            ? "String can not be empty."
            : errorOnSaveText
            ? errorOnSaveText
            : null,
      };
    },
    deletedesignation: async (parent, args, { req }) => {
      req.userID = verifyTokenWithUserID(args, req);
      if (req.userID == null) return null;

      let isDesignationAlreadyUsed = false;
      let designationUserData = await db.users.findOne({
        where: {
          designationId: args.id,
        },
      });
      if (designationUserData) {
        isDesignationAlreadyUsed = true;
      } else {
        await db.designations.destroy({
          where: {
            id: args.id,
          },
        });
      }
      return {
        success: !isDesignationAlreadyUsed,
        error: isDesignationAlreadyUsed ? "Designation is in use." : null,
      };
    },
    requestresettoken: async (parent, args, { req }) => {
      let userData = await db.users.findOne({
        where: {
          email: args.email,
        },
      });
      var emailMatch = false;
      var emailErrorText = "";
      if (userData) {
        emailMatch = true;
        const token = crypto.randomBytes(20).toString("hex");
        userData.resetPasswordToken = token;
        userData.resetPasswordExpires = Date.now() + 3600000;

        userData.save();

        var transport = {
          port: 465,
          host: mailerConfig.HOST,
          secure: true, // e.g. smtp.gmail.com
          auth: {
            user: mailerConfig.USERNAME,
            pass: mailerConfig.PASSWORD,
          },
        };
        try {
          var transporter = nodemailer.createTransport(transport);

          //transporter.verify((error, success) => {
          //if (error) {
          //  console.log(error);
          // } else {
          //   console.log("mailing service is ready");
          //  }
          //});

          const subject = "Link to reset password";
          const email = args.email;

          var mail = {
            from: mailerConfig.EMAIL,
            to: email,
            subject: subject,

            text: `You've asked to reset your password for the GreenMarketingCRM account associated with this email address (${email}). To get the password reset code, please click on the following link:\n\n${mailerConfig.WEBSITEURL}/${token}`,
          };

          try {
            let info = await transporter.sendMail(mail);
          } catch (err) {
            console.log("Email Error Details", err);
            emailErrorText = "Email unable to sent. Please contact admin.";
          }
        } catch (e) {
          console.log("Email Error Details 2", err);
        }
      }
      return {
        success: emailMatch && emailErrorText == "",
        error: !emailMatch
          ? "Email not found."
          : emailErrorText != ""
          ? emailErrorText
          : null,
      };
    },
    changepasswordfromvalidresettoken: async (parent, args, { req }) => {
      let userData = await db.users.findOne({
        where: {
          resetPasswordToken: args.token,
          resetPasswordExpires: {
            [Op.gt]: Date.now(),
          },
        },
      });
      var validToken = false;

      if (userData) {
        validToken = true;
        const token = crypto.randomBytes(20).toString("hex");
        userData.resetPasswordToken = null;
        userData.resetPasswordExpires = null;
        userData.password = args.password;

        try {
          await userData.save();
        } catch (e) {
          console.log("asdas", e);
        }
      }
      return {
        success: validToken,
        error: !validToken
          ? "Password reset link is invalid or has expired."
          : null,
      };
    },
  },
};
