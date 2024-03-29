const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");
const { GraphQLDate } = require("graphql-iso-date");

const VitalEntryTypeEnum = new GraphQLEnumType({
  name: "VitalEntryTypeEnum",
  values: {
    CLINICAL: { value: "CLINICAL" },
    DAILY: { value: "DAILY" },
  },
});

const VitalsType = new GraphQLObjectType({
  name: "Vitals",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    bodyTemperature: { type: new GraphQLNonNull(GraphQLString) },
    heartRate: { type: new GraphQLNonNull(GraphQLString) },
    bloodPressure: { type: new GraphQLNonNull(GraphQLString) },
    respiratoryRate: { type: new GraphQLNonNull(GraphQLString) },
    weight: { type: new GraphQLNonNull(GraphQLString) },
    entryType: { type: new GraphQLNonNull(VitalEntryTypeEnum) },
    createdAt: { type: new GraphQLNonNull(GraphQLDate) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDate) },
  }),
});

module.exports = VitalsType;
