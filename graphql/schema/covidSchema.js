const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat,
} = require("graphql");

const covidResolver = require("../resolvers/covidResolver");

//CovidRootQueryType for Read Operations
const CovidRootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Covid Query",
  fields: covidResolver.Query,
});

//CovidRootMutationType for CRUD Operations --> create, update, and delete operations
const CovidRootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Covid Mutation",
  fields: covidResolver.Mutation,
});

module.exports = new GraphQLSchema({
  query: CovidRootQueryType,
  mutation: CovidRootMutationType,
});
