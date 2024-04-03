const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLBoolean,
} = require("graphql");
const { GraphQLDate } = require("graphql-iso-date");

const CovidType = new GraphQLObjectType({
  name: "Covid",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    userID: { type: new GraphQLNonNull(GraphQLString) },
    shortnessOfBreath: { type: new GraphQLNonNull(GraphQLInt) },
    feverOrChills: { type: new GraphQLNonNull(GraphQLInt) },
    dryCough: { type: new GraphQLNonNull(GraphQLInt) },
    soreThroat: { type: new GraphQLNonNull(GraphQLInt) },
    congestionOrRunnyNose: { type: new GraphQLNonNull(GraphQLInt) },
    Headache: { type: new GraphQLNonNull(GraphQLInt) },
    Fatigue: { type: new GraphQLNonNull(GraphQLInt) },
    muscleOrBodyAches: { type: new GraphQLNonNull(GraphQLInt) },
    lossOfTasteOrSmell: { type: new GraphQLNonNull(GraphQLInt) },
    risk: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(GraphQLDate) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDate) },
  }),
});

module.exports = CovidType;
