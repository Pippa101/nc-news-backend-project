const {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  updateVotes,
  insertComment,
  fetchUsers,
} = require("./models");
function getApiMsg(req, res, next) {
  return res.status(200).send({ msg: "server working" }).catch(next);
}

function getTopics(req, res, next) {
  return fetchTopics()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch(next);
}

function getArticles(req, res, next) {
  const query = req.query;
  console.log(query);
  return fetchArticles(query)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
}

function getArticleById(req, res, next) {
  const { article_id } = req.params;

  return fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
}

function getArticleComments(req, res, next) {
  const { article_id } = req.params;
  const checkId = fetchArticleById(article_id);
  const getComments = fetchCommentsByArticleId(article_id);
  return Promise.all([getComments, checkId])
    .then((comments) => {
      res.status(200).send(comments[0]);
    })
    .catch(next);
}

function postComment(req, res, next) {
  const { article_id } = req.params;
  const newComment = req.body;
  return insertComment(newComment, article_id)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch(next);
}

function updateArticleVotes(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const insert = updateVotes(article_id, inc_votes);
  const checkId = fetchArticleById(article_id);
  return Promise.all([insert, checkId])
    .then((updatedArticle) => {
      res.status(202).send(updatedArticle[0]);
    })
    .catch(next);
}

function getUsers(req, res, next) {
  return fetchUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
}

module.exports = {
  getApiMsg,
  getTopics,
  getArticles,
  getArticleById,
  getArticleComments,
  updateArticleVotes,
  postComment,
  getUsers,
};
