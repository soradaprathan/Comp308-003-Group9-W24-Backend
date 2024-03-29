const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat,
} = require("graphql");

const tipResolver = require("../resolvers/tipResolver");

//TipRootQueryType for Read Operations
const TipRootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Tip Query",
  fields: tipResolver.Query,
});

//TipRootMutationType for CRUD Operations --> create, update, and delete operations
const TipRootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Tip Mutation",
  fields: tipResolver.Mutation,
});

module.exports = new GraphQLSchema({
  query: TipRootQueryType,
  mutation: TipRootMutationType,
});
