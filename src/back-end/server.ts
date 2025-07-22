import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";

import connectDB from "./config/dbConnect";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";

import OnboardingApplicationRoutes from "./routes/OnboardingApplicationRoutes";
import UserRoutes from "./routes/UserRoutes";
import VisaStatusManagementRoutes from "./routes/VisaStatusManagementRoutes";
import RegistrationTokenRoutes from "./routes/RegistrationTokenRoutes";

const app = express();
const PORT = process.env.PORT || 3004;

async function startApolloServer() {
  await connectDB();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await apolloServer.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(apolloServer, {
      context: async ({req}) => {
        return { user: null }; 
      },
    })
  );

  // Add routes
  app.use("/", UserRoutes);
  app.use("/", OnboardingApplicationRoutes);
  app.use("/", VisaStatusManagementRoutes);
  app.use("/", RegistrationTokenRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startApolloServer().catch((error) => {
  console.error("Error starting the server:", error);
});