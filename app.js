const express = require("express");
const app = express();
const logger = require("./src/common/utils/logger");
const dotenv = require("dotenv");
if (process.env.NODE_ENV == "production") {
  dotenv.config({ path: "./.env.production" });
} else {
  dotenv.config({ path: "./.env.development" });
}
const host = process.env.HOST || "http://localhost";
const port = process.env.PORT || 4001;

app.use(express.json());

const userRoute = require("./src/modules/user-service/routes");
const { errorHandler } = require("./src/common/utils/errorHandler");

app.use("/api/users", userRoute);

app.use((error, req, res, next) => {
  errorHandler(error, res);
});

app.get("/", (req, res) => res.send("Taxfiling Server is running"));
app.listen(port, () => logger.info(`Server is listening on ${host}:${port}`));
