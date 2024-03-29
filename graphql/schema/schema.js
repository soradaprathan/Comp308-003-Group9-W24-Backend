const { GraphQLSchema, GraphQLObjectType } = require("graphql");

// Import your type definitions
const UserType = require("../types/userType");
const VitalsType = require("../types/vitalsType");
const AlertType = require("../types/alertType");
const TipType = require("../types/tipType");

// Import your resolvers
const userResolver = require("../resolvers/userResolver");
const vitalResolver = require("../resolvers/vitalsResolver");
const alertResolver = require("../resolvers/alertResolver");
const tipResolver = require("../resolvers/tipResolver");

// Create a RootQuery by merging queries from both domains
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...userResolver.Query,
    ...vitalResolver.Query,
    ...alertResolver.Query,
    ...tipResolver.Query,
  },
});

// Create a RootMutation by merging mutations from both domains
const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    ...userResolver.Mutation,
    ...vitalResolver.Mutation,
    ...alertResolver.Mutation,
    ...tipResolver.Mutation,
  },
});

// Create the combined schema
const combinedSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

module.exports = combinedSchema;
