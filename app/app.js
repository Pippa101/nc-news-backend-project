const express = require("express");
const app = express();
const {
  getApiMsg,
  getTopics,
  getArticles,
  getArticleById,
  getArticleComments,
} = require("./controllers");
const {
  customErrorHandler,
  psqlErrorHandler,
  catch500,
} = require("./error-handling-controllers");

app.get("/api", getApiMsg);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleComments);

app.use(customErrorHandler);
app.use(psqlErrorHandler);

app.all(catch500);
module.exports = app;
