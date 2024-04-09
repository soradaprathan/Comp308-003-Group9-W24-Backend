const { GraphQLSchema, GraphQLObjectType } = require("graphql");

// Import your type definitions
const UserType = require("../types/userType");
const VitalsType = require("../types/vitalsType");
const CovidType = require("../types/covidType");

// Import your resolvers
const userResolver = require("../resolvers/userResolver");
const vitalResolver = require("../resolvers/vitalsResolver");
const covidResolver = require("../resolvers/covidResolver");

// Create a RootQuery by merging queries from both domains
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...userResolver.Query,
    ...vitalResolver.Query,
    ...covidResolver.Query,
  },
});

// Create a RootMutation by merging mutations from both domains
const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    ...userResolver.Mutation,
    ...vitalResolver.Mutation,
    ...covidResolver.Mutation,
  },
});

// Create the combined schema
const combinedSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

module.exports = combinedSchema;
