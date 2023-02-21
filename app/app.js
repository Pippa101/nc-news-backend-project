const express = require("express");
const app = express();
const { getApiMsg, getTopics, getArticles } = require("./controllers");
const {
  errorHandler500,
  errorHandler400s,
} = require("./error-handling-controllers");

app.get("/api", getApiMsg);

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

app.use(errorHandler500);
app.use(errorHandler400s);
module.exports = app;
