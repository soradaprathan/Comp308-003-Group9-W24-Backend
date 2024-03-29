const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLEnumType,
} = require("graphql");

const EntryTypeEnum = new GraphQLEnumType({
  name: "EntryType",
  values: {
    CLINICAL: { value: "CLINICAL" },
    DAILY: { value: "DAILY" },
  },
});

const VitalInputType = new GraphQLInputObjectType({
  name: "VitalInput",
  fields: {
    bodyTemperature: { type: new GraphQLNonNull(GraphQLString) },
    heartRate: { type: new GraphQLNonNull(GraphQLString) },
    bloodPressure: { type: new GraphQLNonNull(GraphQLString) },
    respiratoryRate: { type: new GraphQLNonNull(GraphQLString) },
    weight: { type: new GraphQLNonNull(GraphQLString) },
    entryType: { type: new GraphQLNonNull(EntryTypeEnum) },
  },
});

module.exports = VitalInputType;
