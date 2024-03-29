require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const { GraphQLSchema, GraphQLObjectType } = require("graphql");

const userSchema = require("./graphql/schema/userSchema");
//const vitalSchema = require("./graphql/schema/vitalSchema");

const { createToken, requireAuth, checkRole } = require("./utils/utils");

// app.use(express.static("public"));
app.use(express.json());
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

// app.use(
//   "/graphql",
//   graphqlHTTP((req, res) => ({
//     schema: schema,
//     graphiql: true,
//     context: { res },
//   }))
// );
app.use(
  "/graphql",
  requireAuth,
  graphqlHTTP((req, res) => ({
    schema: userSchema,
    graphiql: true,
    context: {
      user: req.user,
      res,
    },
  }))
);

// app.listen(3000, () => console.log("Server Started"));
