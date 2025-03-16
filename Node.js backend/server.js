const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const healthRouter = require("./healthcheck/healcheck.route");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

const app = express();
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api/v1", healthRouter);

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
