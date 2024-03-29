const bodyParser = require("body-parser");
require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./graphql/schema/schema");

const { createToken, requireAuth, checkRole } = require("./utils/utils");

// app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Connect to MongoDB
const connectionString = process.env.MONGODB_CONNECTION_STRING;
mongoose
  .connect(connectionString)
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`Server is listening on port ${process.env.PORT}...`)
    )
  )
  .catch((err) => console.log(err));

// const loggingMiddleware = (req, res, next) => {
//   next();
// };

app.use(
  "/graphql",
  requireAuth,
  graphqlHTTP((req, res) => ({
    schema: schema,
    graphiql: true,
    context: {
      user: req.user,
      res,
    },
  }))
);

var tensorflow = require("./TensorFlow/predict");

app.post("/predict", tensorflow.trainAndPredict);
