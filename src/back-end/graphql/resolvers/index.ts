import { userResolvers } from "./user";
import { visaResolvers } from "./visa";

// Merge resolvers
export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...visaResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...visaResolvers.Mutation,
  },
};
