const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");
const { GraphQLDate } = require("graphql-iso-date");

const AlertType = new GraphQLObjectType({
  name: "Alert",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    userID: { type: new GraphQLNonNull(GraphQLString) },
    alertName: { type: new GraphQLNonNull(GraphQLString) },
    alertDescription: { type: new GraphQLNonNull(GraphQLString) },
    status: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(GraphQLDate) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDate) },
  }),
});

module.exports = AlertType;
