const { GraphQLNonNull, GraphQLString, GraphQLList } = require("graphql");
const Tip = require("../../models/tip");
const TipType = require("../types/tipType");
const { requireAuth } = require("../../utils/utils");
const tipResolver = {
  Query: {
    tipsByNurseAndPatient: {
      type: new GraphQLList(TipType),
      args: {
        nurseId: { type: new GraphQLNonNull(GraphQLString) },
        patientId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { nurseId, patientId }, context) => {
        try {
          requireAuth(context.req, context.res, () => {});
          const tips = await Tip.find({
            nurseId: nurseId,
            patientId: patientId,
          });
          return tips;
        } catch (error) {
          throw new Error("Error fetching tips: " + error.message);
        }
      },
    },
  },
  Mutation: {
    createTip: {
      type: TipType,
      args: {
        nurseId: { type: new GraphQLNonNull(GraphQLString) },
        patientId: { type: new GraphQLNonNull(GraphQLString) },
        tipName: { type: new GraphQLNonNull(GraphQLString) },
        tipDescription: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (
        _,
        { nurseId, patientId, tipName, tipDescription, status },
        context
      ) => {
        try {
          requireAuth(context.req, context.res, () => {});
          const newTip = new Tip({
            nurseId,
            patientId,
            tipName,
            tipDescription,
            status,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          // Save the Tip to the database
          await newTip.save();

          // Return the newly created Tip
          return newTip;
        } catch (error) {
          throw new Error("Error creating Tip: " + error.message);
        }
      },
    },
  },
};
module.exports = tipResolver;
