const {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLString,
} = require("graphql");

const CovidUpdateInputType = new GraphQLInputObjectType({
  name: "CovidUpdateInput",
  fields: {
    shortnessOfBreath: { type: GraphQLInt },
    feverOrChills: { type: GraphQLInt },
    dryCough: { type: GraphQLInt },
    soreThroat: { type: GraphQLInt },
    congestionOrRunnyNose: { type: GraphQLInt },
    Headache: { type: GraphQLInt },
    Fatigue: { type: GraphQLInt },
    muscleOrBodyAches: { type: GraphQLInt },
    lossOfTasteOrSmell: { type: GraphQLInt },
    risk: { type: GraphQLString },
  },
});
module.exports = CovidUpdateInputType;
