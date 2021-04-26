var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var db = require("./database/db");
var initialDatabaseEntry = require("./database/initialDatabaseEntry");
var { ApolloServer } = require("apollo-server-express");
var GraphQLTypes_ = require("./graphql/typeDefs");
var GraphQLResolvers_ = require("./graphql/resolvers");
var { verify } = require("jsonwebtoken");
var Auth = require("./auth");
var secrets = require("./config/secrets.json");
var { sameSiteCookieMiddleware } = require("express-samesite-default");
var { json } = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
var cors = require("cors");
var _ = require("lodash");
const app = express();

app.enable("trust proxy");
app.use(sameSiteCookieMiddleware());
app.use(cookieParser());

app.use(json({ limit: "200mb" }));

const env = process.env.NODE_ENV || "development";

var corsOptions = {
  // origin: config.front_end_url,
  origin: true,
  credentials: true, // <-- REQUIRED backend setting
};

// Body parser
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var chatCircleUsersWithChats = [];
const server = new ApolloServer({
  typeDefs: GraphQLTypes_,
  resolvers: GraphQLResolvers_,

  subscriptions: {
    onConnect: (connectionParams, webSocket, context) => {
      console.log(webSocket.upgradeReq.url);
      const agentId = webSocket.upgradeReq.url.replace(
        "/subscriptions?userId=",
        ""
      );
      if (!_.find(chatCircleUsersWithChats, (item) => item.agentId == agentId))
        chatCircleUsersWithChats.push({ agentId: agentId, chats: [] });
      console.log("user loggedin", agentId);
      console.log("chatCircleUsersWithChats", chatCircleUsersWithChats);
    },
    onDisconnect: (webSocket, context) => {
      const agentId = webSocket.upgradeReq.url.replace(
        "/subscriptions?userId=",
        ""
      );
      _.remove(chatCircleUsersWithChats, (item) => item.agentId == agentId);
      console.log("user loggedout", agentId);
    },
    path: "/subscriptions",
    // ...other options...
  },
  context: ({ req, res }) => ({ req, res }),
});
//using one domain on server wit hsame port
//if (process.env.NODE_ENV === "production") {
 // app.use(express.static(path.join(__dirname, "client/build")));
   //app.get('*', (req, res) => {    res.sendfile(path.join(__dirname = 'client/build/index.html'));  })
//}
app.use(async (req, res, next) => {
  const accessToken = req.cookies["access-token"];
  const refreshToken = req.cookies["refresh-token"];

  if (!refreshToken && !accessToken) {
    return next();
  }

  try {
    const validData = verify(accessToken, secrets.ACCESS_TOKEN_SECRET);

    req.userID = validData.userID;

    return next();
  } catch (e) {
    console.log(e);
  }

  if (!refreshToken) return next();

  let data_;

  try {
    data_ = verify(refreshToken, secrets.REFRESH_TOKEN_SECRET);
  } catch (e) {
    return next();
  }

  const user = await db.users.findOne({
    where: {
      id: data_.userID,
    },
  });
  // token has been invalidated
  if (!user) {
    return next();
  }

  const tokens = new Auth().createTokensInCookies(user.id, res);

  //console.log(verify(tokens.refreshToken, secrets.REFRESH_TOKEN_SECRET))

  req.userID = user.id;

  return next();
  //res.status(404).json({ errors: { global: "Still working on it. Please try again later when we implement it." } });
});

server.applyMiddleware({
  app: app,
  path: `/graphql`,
  cors: false,
});

if (env == "development") {
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  );
  server.installSubscriptionHandlers(httpsServer);
  httpsServer.listen(process.env.PORT, () => {
    console.log(
      `🚀 Server ready at https://localhost:${process.env.PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at wss://localhost:${process.env.PORT}${server.subscriptionsPath}`
    );
  });
} else {
  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);
  httpServer.listen(process.env.PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${server.subscriptionsPath}`
    );
  });
}
//Sync database with Sequelize models
db.sequelize
  .sync()
  .then(() => {
    let initialDatabaseEntryObj = new initialDatabaseEntry();
    initialDatabaseEntryObj.insertInitialData(db);
  })
  .catch((error) => console.log("This error occured", error));

app.post("/webhook/", (req, res) => {
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === "page") {
    console.log(req.body);
    var pageId = req.body.entry[0].id;
    var messaging_events = req.body.entry[0].messaging;

    for (i = 0; i < messaging_events.length; i++) {
      var event_ = req.body.entry[0].messaging[i];
      var isPage = pageId == event_.sender.id;
      var customerId = isPage ? event_.recipient.id : event_.sender.id;
      if (event_.message && event_.message.text) {
        var timestamp = event_.timestamp;
        var messageId = event_.message.mid;
        var messageText = event_.message.text;
        // Your Logic Replaces the following Line
        getUserFromChatCircle(customerId).then((result) => {
          console.log("chat binding on userid", result);
          if (result) {
            console.log({
              customerId: customerId,
              pageId: pageId,
              messagetext: messageText,
              messagetimestamp: timestamp,
              messageId: messageId,
              messagetype: isPage ? "outgoing" : "incoming",
              agentId: result,
            });
            GraphQLResolvers_.Mutation.addchatdetail(null, {
              customerId: customerId,
              pageId: pageId,
              messagetext: messageText,
              messagetimestamp: timestamp,
              messageId: messageId,
              messagetype: isPage ? "outgoing" : "incoming",
              agentId: result,
            });

            var chatAgent = _.find(
              chatCircleUsersWithChats,
              (item) => item.agentId == result
            );

            if (chatAgent) {
              if (
                !_.find(
                  chatAgent.chats,
                  (item) =>
                    item.customerId == customerId && item.pageId == pageId
                )
              )
                chatAgent.chats.push({
                  customerId: customerId,
                  pageId: pageId,
                });
            }
          }
        });
      }
    }

    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

const getUserFromChatCircle = async (customerId) => {
  if (chatCircleUsersWithChats.length > 0) {
    let chatData = await db.chatdetails.findOne({
      where: {
        customerId: customerId,
      },
    });

    if (chatData) {
      //agent last chated with customer
      // var agentIsOnline = _.find(
      //   chatCircleUsersWithChats,
      //   (item) => item.agentId == chatData.agentId
      //  );

      // if (agentIsOnline) {
      //   return agentIsOnline.agentId;
      // }
      return chatData.agentId;
    }
    //agent have less chats
    var chatCircleUsersWithChatsTemp = _.cloneDeep(chatCircleUsersWithChats);
    chatCircleUsersWithChatsTemp.sort(function (a, b) {
      return a.chats.length - b.chats.length;
    });

    var onlineAgentHaveLessChats = chatCircleUsersWithChatsTemp[0];

    return onlineAgentHaveLessChats.agentId;
  }
};
app.get("/webhook/", (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "123123123";

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
