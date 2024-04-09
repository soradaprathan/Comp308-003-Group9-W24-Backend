const { GraphQLNonNull, GraphQLString, GraphQLList } = require("graphql");
const User = require("../../models/user");
const VitalType = require("../types/vitalsType");
const VitalInputType = require("../types/vitalInputType");
const { requireAuth } = require("../../utils/utils");

const vitalResolver = {
  Query: {
    //get specific vital for a user
    getVitalForUser: {
      type: VitalType,
      args: {
        userID: { type: new GraphQLNonNull(GraphQLString) },
        vitalId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { userID, vitalId }, context) => {
        requireAuth(context.req, context.res, () => {
          console.log("context.req.user:", context.req.user);
          const userAuth = context.req.user;

          console.log("Test Auth", userAuth);
          //console.log(`Requesting user ID: ${context.user.userID}`);
          console.log(
            `Logged in user ID: ${context.req.user.userID}, role: ${context.req.user.role}`
          );

          if (!context.req.user) {
            console.log(`Requesting user ID: ${userID}`);
            throw new Error(
              "Unauthorized! You must be logged in to access vitals."
            );
          }
          // Allow Nurses to access any vitals and Patients to access only their own vitals
          if (
            !(
              context.req.user.role === "Nurse" ||
              (context.req.user.role === "Patient" &&
                context.req.user.userID === userID)
            )
          ) {
            throw new Error(
              "Unauthorized! You do not have permission to access these vitals."
            );
          }
        });
        const user = await User.findOne({ userID: userID });
        if (!user) throw new Error("User not found");
        console.log("Vital User:", user.userID);
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
      resolve: async (_, { userID }, context) => {
        try {
          const authenticatedUser = await new Promise((resolve, reject) => {
            requireAuth(context.req, context.res, () => {
              if (context.req.user) {
                console.log("Authenticated user ID:", context.req.user.id);
                resolve(context.req.user); // Resolve the promise with the authenticated user
              } else {
                reject(
                  new Error(
                    "Unauthorized! You must be logged in to view vitals."
                  )
                );
              }
            });
          });

          // Perform the authorization check based on roles or user IDs
          console.log(`Requesting user ID: ${userID}`);
          console.log(
            `Logged in user ID: ${authenticatedUser.id}, role: ${authenticatedUser.role}`
          );

          const user = await User.findOne({ userID: userID });
          if (!user) {
            throw new Error("User not found");
          }

          // Uncomment and adjust this check as needed based on your application's logic
          if (
            authenticatedUser.id !== user.id &&
            authenticatedUser.role !== "Nurse"
          ) {
            throw new Error(
              "Unauthorized! You can only access your own vitals or must be a Nurse to access others' vitals."
            );
          }

          return user.vitals;
        } catch (error) {
          // Handle errors that may occur during authentication, authorization, or data fetching
          throw new Error(error.message);
        }
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
      resolve: async (_, { userID, vitalData }, context) => {
        requireAuth(context.req, context.res, () => {});
        const user = await User.findOne({ _id: userID });
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
    updateVital: {
      type: VitalType,
      args: {
        vitalID: { type: new GraphQLNonNull(GraphQLString) },
        vitalData: { type: new GraphQLNonNull(VitalInputType) },
      },
      resolve: async (_, { vitalID, vitalData }, context) => {
        return new Promise((resolve, reject) => {
          requireAuth(context.req, context.res, async () => {
            if (!context.req.user) {
              return reject(
                new Error(
                  "Unauthorized! You must be logged in to update a vital."
                )
              );
            }
            try {
              const user = await User.findOne({ "vitals._id": vitalID });
              if (!user) {
                return reject(
                  new Error(
                    "User not found or does not have the specified vital."
                  )
                );
              }

              if (
                context.req.user.id !== user.id &&
                context.req.user.role !== "Nurse"
              ) {
                return reject(
                  new Error("Unauthorized! You cannot update this vital.")
                );
              }

              const vital = user.vitals.id(vitalID);
              if (!vital) {
                return reject(new Error("Vital not found."));
              }
              Object.assign(vital, vitalData);
              await user.save();

              resolve(vital);
            } catch (error) {
              reject(error);
            }
          });
        });
      },
    },
    deleteVital: {
      type: GraphQLString,
      args: {
        vitalID: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { vitalID }, context) => {
        // Wrap the requireAuth call in a promise to use it with async/await
        await new Promise((resolve, reject) => {
          requireAuth(context.req, context.res, () => {
            if (context.req.user) {
              resolve();
            } else {
              reject(
                new Error(
                  "Unauthorized! You must be logged in to delete a vital."
                )
              );
            }
          });
        });

        // Proceed with the deletion logic after authentication
        const user = await User.findOne({ "vitals._id": vitalID });
        if (!user) {
          throw new Error(
            "User not found or does not have the specified vital."
          );
        }

        // Authorization check
        if (
          context.req.user.id !== user.id &&
          context.req.user.role !== "Nurse"
        ) {
          throw new Error("Unauthorized! You cannot delete this vital.");
        }

        // Find index and remove the vital from the array
        const index = user.vitals.findIndex((v) => v.id === vitalID);
        if (index === -1) {
          throw new Error("Vital not found.");
        }
        user.vitals.splice(index, 1);

        // Save the user document to apply the changes
        await user.save();

        return "Vital deleted successfully.";
      },
    },

    //other mutations
  },
};
module.exports = vitalResolver;
