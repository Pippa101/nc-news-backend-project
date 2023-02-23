const express = require("express");
const app = express();
const {
  getApiMsg,
  getTopics,
  getArticles,
  getArticleById,
  getArticleComments,
  updateArticleVotes,
  postComment,
} = require("./controllers");
const {
  customErrorHandler,
  psqlErrorHandler,
  catch500,
} = require("./error-handling-controllers");
app.use(express.json());
app.get("/api", getApiMsg);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleComments);

app.patch("/api/articles/:article_id", updateArticleVotes);

app.post("/api/articles/:article_id/comments", postComment);
app.use(customErrorHandler);
app.use(psqlErrorHandler);

app.all(catch500);
module.exports = app;
