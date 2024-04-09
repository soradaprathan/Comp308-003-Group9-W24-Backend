const { GraphQLObjectType, GraphQLString, GraphQLNonNull } = require("graphql");

const { GraphQLDate } = require("graphql-iso-date");

// Define a UserType for GraphQL
const LoginReturnType = new GraphQLObjectType({
  name: "LoginReturn",
  fields: () => ({
    token: { type: new GraphQLNonNull(GraphQLString) },
    role: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

module.exports = LoginReturnType;
