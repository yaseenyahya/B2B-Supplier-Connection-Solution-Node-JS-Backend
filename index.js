require("dotenv").config({ path: ".env" });
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var helmet = require("helmet");
var { ApolloServer } = require("apollo-server-express");
var GraphQLTypes_ = require("./graphql/typeDefs");
var GraphQLResolvers_ = require("./graphql/resolvers");
var { sameSiteCookieMiddleware } = require("express-samesite-default");
var { json } = require("express");
const multer = require("multer");
const https = require("https");
const http = require("http");
var cors = require("cors");
var _ = require("lodash");
const app = express();
var path = require("path");
const otherconfig = require("./config/otherconfig.json");

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

app.use(otherconfig[process.env.NODE_ENV].upload_dir,express.static(__dirname + otherconfig[process.env.NODE_ENV].upload_dir));

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
  subscriptions: {
    keepAlive: 10000,
    onConnect: (connectionParams, webSocket, context) => {
    },
    path: "/subscriptions",
  },
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
server.installSubscriptionHandlers(httpServer);
httpServer
  .listen(process.env.PORT, () => {
    console.log(
      `(${process.env.NODE_ENV}) 🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${server.subscriptionsPath}`
    );
  })
  .on("error", (err) => {
    console.error("Server starting error", err);
  });

const uploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },

  filename: function (req, file, cb) {
    var ext = path.extname(file.originalname);
    cb(
      null,
      file.originalname
    );
  },
});
var upload = multer({ storage: uploadStorage });

app.post("/upload_add", upload.array("images"), async (req, res) => {
  var filenames = _.map(req.files, "originalname");

  try {
   let product =  await GraphQLResolvers_.Mutation.add_product(
      null,
      {
        user_id: req.body.product_user_id,
        category_b_id: req.body.product_category_b,
        category_c_id: req.body.product_category_c,
        product_color:req.body.product_color,
        title: req.body.product_title,
        price: req.body.product_price,
        discount_quantity: req.body.product_discount_quantity,
        discount_price: req.body.product_discount_price,
        description: req.body.product_description,
        media_serialized: JSON.stringify(filenames),
      },
      { GraphQLResolvers_ }
    );
    res.status(200).json({ product:product });
  } catch (ex) {
    res.status(404).json({ message: ex });
  }

});
app.post("/upload_edit", upload.array("images"), (req, res) => {
 
  try {

    GraphQLResolvers_.Mutation.edit_product(
      null,
      {
        product_id:req.body.product_id,
        user_id: req.body.product_user_id,
        category_b_id: req.body.product_category_b,
        category_c_id: req.body.product_category_c,
        product_color:req.body.product_color,
        title: req.body.product_title,
        price: req.body.product_price,
        discount_quantity: req.body.product_discount_quantity,
        discount_price: req.body.product_discount_price,
        description: req.body.product_description,
        media_serialized: req.body.product_filenames,
      },
      { GraphQLResolvers_ }
    );
    res.status(200).json({ message: "ok" });
  } catch (ex) {
    res.status(404).json({ message: ex });
  }

});
