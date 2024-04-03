const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} = require("graphql");
const Covid = require("../../models/covid");
const CovidType = require("../types/covidType");
const CovidUpdateInputType = require("../types/covidUpdateInput");
const { requireAuth } = require("../../utils/utils");

const covidResolver = {
  Query: {
    getCovidByUserID: {
      type: new GraphQLList(CovidType),
      args: {
        userID: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { userID }, context) => {
        try {
          requireAuth(context.req, context.res, () => {});
          const covids = await Covid.find({ userID });
          return covids;
        } catch (error) {
          throw new Error("Error fetching covids: " + error.message);
        }
      },
    },
    getAllCovid: {
      type: new GraphQLList(CovidType),
      resolve: async (_, args, context) => {
        try {
          requireAuth(context.req, context.res, () => {});
          const allCovidEntries = await Covid.find({});
          return allCovidEntries;
        } catch (error) {
          throw new Error("Error fetching all covid entries: " + error.message);
        }
      },
    },
  },
  Mutation: {
    createCovid: {
      type: CovidType,
      args: {
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
      },
      resolve: async (
        _,
        {
          userID,
          shortnessOfBreath,
          feverOrChills,
          dryCough,
          soreThroat,
          congestionOrRunnyNose,
          Headache,
          Fatigue,
          muscleOrBodyAches,
          lossOfTasteOrSmell,
          risk,
        },
        context
      ) => {
        try {
          requireAuth(context.req, context.res, () => {});
          // Create a new covid using the Covid Mongoose model
          const newCovid = new Covid({
            userID,
            shortnessOfBreath,
            feverOrChills,
            dryCough,
            soreThroat,
            congestionOrRunnyNose,
            Headache,
            Fatigue,
            muscleOrBodyAches,
            lossOfTasteOrSmell,
            risk,
          });

          // Save the covid to the database
          await newCovid.save();

          // Return the newly created covid
          return newCovid;
        } catch (error) {
          throw new Error("Error creating covid: " + error.message);
        }
      },
    },
    editCovid: {
      type: CovidType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        updateFields: { type: new GraphQLNonNull(CovidUpdateInputType) },
      },
      resolve: async (_, { id, updateFields }, context) => {
        try {
          requireAuth(context.req, context.res, () => {});

          const updatedCovid = await Covid.findByIdAndUpdate(id, updateFields, {
            new: true,
          });
          if (!updatedCovid) {
            throw new Error("Covid entry not found");
          }
          return updatedCovid;
        } catch (error) {
          throw new Error("Error updating covid: " + error.message);
        }
      },
    },

    deleteCovid: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { id }, context) => {
        try {
          requireAuth(context.req, context.res, () => {});
          const deletedCovid = await Covid.findByIdAndDelete(id);
          if (!deletedCovid) {
            return "Covid entry not found or already deleted";
          }
          return "Covid entry deleted successfully";
        } catch (error) {
          throw new Error("Error deleting covid: " + error.message);
        }
      },
    },
  },
};

module.exports = covidResolver;
