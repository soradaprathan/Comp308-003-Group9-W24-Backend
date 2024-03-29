const { GraphQLNonNull, GraphQLString, GraphQLList } = require("graphql");
const User = require("../../models/user");
const VitalType = require("../types/vitalsType");
const VitalInputType = require("../types/vitalInputType");
const vitalResolver = {
  Query: {
    //get specific vital for a user
    getVitalForUser: {
      type: VitalType,
      args: {
        userID: { type: new GraphQLNonNull(GraphQLString) },
        vitalId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { userID, vitalId }) => {
        const user = await User.findOne({ userID: userID });
        if (!user) throw new Error("User not found");
        const vital = user.vitals.id(vitalId);
        if (!vital) throw new Error("Vital not found");

        return vital;
      },
    },
    // Fetch all vitals for a specific user
    getAllVitalsForUser: {
      type: new GraphQLList(VitalType),
      args: {
        userID: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { userID }) => {
        const user = await User.findOne({ userID: userID });
        if (!user) throw new Error("User not found");
        return user.vitals;
      },
    },
  },
  Mutation: {
    addVitalToUser: {
      type: VitalType,
      args: {
        userID: { type: new GraphQLNonNull(GraphQLString) },
        vitalData: { type: new GraphQLNonNull(VitalInputType) },
      },
      resolve: async (_, { userID, vitalData }) => {
        const user = await User.findOne({ userID: userID });
        if (!user) throw new Error("User not found");

        let newVital = user.vitals.create({
          ...vitalData,
          addedBy: user.userID,
        });

        user.vitals.push(newVital);
        await user.save();

        return newVital; // or `return user.vitals` or `return user`;
      },
    },
    //other mutations
  },
};
module.exports = vitalResolver;
