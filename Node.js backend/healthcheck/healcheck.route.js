const express = require("express");

const healthRouter = express.Router();

healthRouter.get("/healthcheck", (req, res) => {
  res.status(200).json({
    message: "Congratulations! Server is up and running",
  });
});

module.exports = healthRouter;
