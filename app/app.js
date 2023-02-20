const express = require("express");
const app = express();
const { getApiMsg, getTopics } = require("./controllers");
const {
  errorHandler500,
  errorHandler400,
} = require("./error-handling-controllers");

app.use(express.json());

app.get("/api", getApiMsg);

app.get("/api/topics", getTopics);
app.use(errorHandler500);
app.use(errorHandler400);

module.exports = app;
