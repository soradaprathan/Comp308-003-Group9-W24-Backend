const { GraphQLNonNull, GraphQLString, GraphQLList } = require("graphql");
const Alert = require("../../models/alert");
const AlertType = require("../types/alertType");
const { requireAuth } = require("../../utils/utils");

const alertResolver = {
  Query: {
    getAlertsByUserID: {
      type: new GraphQLList(AlertType),
      args: {
        userID: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { userID }, context) => {
        try {
          requireAuth(context.req, context.res, () => {});
          const alerts = await Alert.find({ userID });
          return alerts;
        } catch (error) {
          throw new Error("Error fetching alerts: " + error.message);
        }
      },
    },
  },
  Mutation: {
    createAlert: {
      type: AlertType,
      args: {
        userID: { type: new GraphQLNonNull(GraphQLString) },
        alertName: { type: new GraphQLNonNull(GraphQLString) },
        alertDescription: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (
        _,
        { userID, alertName, alertDescription, status },
        context
      ) => {
        try {
          requireAuth(context.req, context.res, () => {});
          // Create a new alert using the Alert Mongoose model
          const newAlert = new Alert({
            userID,
            alertName,
            alertDescription,
            status,
          });

          // Save the alert to the database
          await newAlert.save();

          // Return the newly created alert
          return newAlert;
        } catch (error) {
          throw new Error("Error creating alert: " + error.message);
        }
      },
    },
  },
};
module.exports = alertResolver;
