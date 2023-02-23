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
  getUsers,
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
app.get("/api/users", getUsers);

app.use(customErrorHandler);
app.use(psqlErrorHandler);

app.all(catch500);
module.exports = app;
