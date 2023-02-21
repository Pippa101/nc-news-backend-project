const express = require("express");
const app = express();
const {
  getApiMsg,
  getTopics,
  getArticles,
  getArticleById,
} = require("./controllers");
const {
  errorHandler500,
  errorHandler400s,
  psqlErrorHandler,
} = require("./error-handling-controllers");

app.get("/api", getApiMsg);

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);

app.use(errorHandler400s);
app.use(psqlErrorHandler);
app.use(errorHandler500);
module.exports = app;
