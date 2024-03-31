const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat,
} = require("graphql");
const vitalResolver = require("../resolvers/vitalsResolver");

//VitalRootQueryType for Read Operations
const VitalRootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Vital Query",
  fields: vitalResolver.Query,
});

//VitalRootMutationType for CRUD Operations --> create, update, and delete operations
const VitalRootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Vital Mutation",
  fields: vitalResolver.Mutation,
});

module.exports = new GraphQLSchema({
  query: VitalRootQueryType,
  mutation: VitalRootMutationType,
});
