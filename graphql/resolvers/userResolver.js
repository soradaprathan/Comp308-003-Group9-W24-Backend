const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat,
} = require("graphql");
const { GraphQLDate } = require("graphql-iso-date");
const User = require("../../models/user");
const UserType = require("../types/userType");
const { createToken, requireAuth, checkRole } = require("../../utils/utils");
const bcrypt = require("bcrypt");

const userResolver = {
  Query: {
    //Fetch a single user
    user: {
      type: UserType,
      description: "Get a single user",
      args: {
        id: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        try {
          const user = await User.findById(args.id);
          return user;
        } catch (error) {
          console.error("Error fetching user:", error);
          throw new Error("Error fetching user");
        }
      },
    },
    //Fetch all users
    users: {
      type: new GraphQLList(UserType),
      description: "Get all users",
      resolve: async () => {
        try {
          const users = await User.find();
          return users;
        } catch (error) {
          console.error("Error fetching user:", error);
          throw new Error("Error fetching user");
        }
      },
    },
    usersByRoleAndId: {
      type: UserType,
      description: "Get a single user by role and ID",
      args: {
        role: { type: GraphQLString },
        id: { type: GraphQLString },
      },
      resolve: async (_, { role, id }) => {
        try {
          const user = await User.findOne({ role, _id: id });
          return user;
        } catch (error) {
          console.error("Error fetching user by role and ID:", error);
          throw new Error("Error fetching user by role and ID");
        }
      },
    },
  },
  Mutation: {
    signup: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: new GraphQLNonNull(GraphQLString) },
        dob: { type: new GraphQLNonNull(GraphQLDate) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (
        _,
        { firstName, lastName, email, password, role, dob, phone, address },
        context
      ) => {
        try {
          const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            role,
            dob,
            phone,
            address,
          });

          const token = createToken(user.id);

          context.res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
          });

          return { ...user._doc, id: user._id, token };
        } catch (error) {
          console.error("Error during signup:", error);
          throw new Error("Signup failed");
        }
      },
    },

    login: {
      type: GraphQLString,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { email, password }, context) => {
        try {
          const user = await User.login(email, password);
          const token = createToken(user.id);
          console.log("Token is " + token);
          context.res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
          });
          // Return a success message
          return `Login Success! Token: ${token}, Role: ${user.role}`;
        } catch (error) {
          console.error("Login error:", error);
          // Handle specific error messages
          if (error.message === "User not found") {
            throw new Error("User not found");
          } else if (
            error.message === "Incorrect password" ||
            error.message === "Incorrect email"
          ) {
            throw new Error("Incorrect email or password");
          }
          // Handle any other unexpected errors
          throw new Error("An error occurred during the login process");
        }
      },
    },
  },
};
module.exports = userResolver;
