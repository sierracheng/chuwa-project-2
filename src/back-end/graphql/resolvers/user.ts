import { User } from "@/back-end/models/User";
import { RegistrationToken } from "@/back-end/models/RegistrationToken";

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, { user }: any) => {
      if (!user) throw new Error("Not authenticated");
      return await User.findById(user._id)
        .populate("onboardingApplication")
        .populate("visaStatusManagement");
    },
    getAllUsers: async () => {
      return await User.find()
        .populate("onboardingApplication")
        .populate("visaStatusManagement");
    },
    getUserById: async (_: any, { id }: { id: string }) => {
      return await User.findById(id)
        .populate("onboardingApplication")
        .populate("visaStatusManagement");
    },
  },

  Mutation: {
    createSimpleUser: async (_: any, { input }: { input: any }) => {
      const tokenDoc = await RegistrationToken.findOne({ token: input.token });
      if (!tokenDoc) throw new Error("Invalid or missing registration token");
      if (tokenDoc.expiresAt < new Date()) throw new Error("Token expired");

      const existingUser = await User.findOne({ email: input.email });
      if (existingUser) throw new Error("User already exists");

      const newUser = new User({
        username: input.username,
        password: input.password,
        email: input.email,
        role: "Employee",
      });

      await newUser.save();
      await RegistrationToken.deleteOne({ _id: tokenDoc._id });

      return newUser;
    },

    findUser: async (_: any, { input }: { input: { username: string; password: string } }) => {
      console.log("🔍 Received login input:", input); // log input from frontend

      const user = await User.findOne({ username: input.username })

      if (!user) {
        throw new Error("Invalid username or password")
      }

      console.log("✅ Found user:", user);


      // NOTE: Use bcrypt if password is hashed — here assuming plain text for simplicity
      const isValidPassword = user.password === input.password
      if (!isValidPassword) {
        console.log("❌ Password does not match. Entered:", input.password, "Expected:", user.password);
        throw new Error("Invalid username or password")
      }

      // Example token — replace with JWT in real use
      const token = `mock-token-${user._id}`

      return {
        success: true,
        message: "Login successful",
        token,
        user: {
          _id: user._id.toString(),
          username: user.username,
          role: user.role,
        },
      }
    },

    updateUser: async (_: any, { id, input }: { id: string; input: any }) => {
      const user = await User.findById(id);
      if (!user) throw new Error("User not found");
      Object.assign(user, input);
      await user.save();
      return user;
    },

    deleteUser: async (_: any, { id }: { id: string }) => {
      const user = await User.findById(id);
      if (!user) throw new Error("User not found");
      await User.deleteOne({ _id: id });
      return user;
    },
  },
};
