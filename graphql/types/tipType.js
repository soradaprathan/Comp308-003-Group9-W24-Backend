const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");
const { GraphQLDate } = require("graphql-iso-date");

const TipType = new GraphQLObjectType({
  name: "Tip",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    nurseId: { type: new GraphQLNonNull(GraphQLString) },
    patientId: { type: new GraphQLNonNull(GraphQLString) },
    tipName: { type: new GraphQLNonNull(GraphQLString) },
    tipDescription: { type: new GraphQLNonNull(GraphQLString) },
    status: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(GraphQLDate) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDate) },
  }),
});

module.exports = TipType;
