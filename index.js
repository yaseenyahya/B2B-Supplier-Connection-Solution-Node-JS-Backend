var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var helmet = require("helmet");
var { ApolloServer } = require("apollo-server-express");
var GraphQLTypes_ = require("./graphql/typeDefs");
var GraphQLResolvers_ = require("./graphql/resolvers");
var { sameSiteCookieMiddleware } = require("express-samesite-default");
var { json } = require("express");
const https = require("https");
const http = require("http");
var cors = require("cors");
var _ = require("lodash");
const app = express();

app.enable("trust proxy");
app.use(sameSiteCookieMiddleware());
app.use(cookieParser());

app.use(json({ limit: "200mb" }));

var corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
    crossOriginEmbedderPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  })
);
app.disable("x-powered-by");

const server = new ApolloServer({
  typeDefs: GraphQLTypes_,
  resolvers: GraphQLResolvers_,
  context: ({ req, res }) => ({
    req,
    res,
    resolver: GraphQLResolvers_,
  }),
});

app.use(async (req, res, next) => {
  return next();
});

server.applyMiddleware({
  app: app,
  path: `/graphql`,
  cors: false,
});

const httpServer = http.createServer(app);

httpServer
  .listen(process.env.PORT, () => {
    console.log(
      `(${process.env.NODE_ENV}) 🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
    );
  })
  .on("error", (err) => {
    console.error("Server starting error", err);
  });
