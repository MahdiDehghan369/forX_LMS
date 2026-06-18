require("dotenv").config();

const Logger = require('sillajLogger');
const AppBuilder = require("forxappbuilder");
const moduleConfigs = require("./moduleConfigs");
const routes = require("./routes");

const connectMongo = require("./config/mongo");
const connectRedis = require("./config/redis");

const appBuilder = new AppBuilder();
appBuilder.registerModuleConfigs(moduleConfigs);
appBuilder.withErrorHandler("errorHandler");
appBuilder.use("cors");


appBuilder.buildRoutes(routes);
const app = appBuilder.getApp();

const startServer = async () => {
  try {
    await connectMongo();
    await connectRedis();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT} port :)`)
    });
  } catch (error) {
    Logger.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
