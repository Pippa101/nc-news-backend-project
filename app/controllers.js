const { fetchTopics, fetchArticles, fetchArticleById } = require("./models");
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
  return fetchArticles()
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

module.exports = { getApiMsg, getTopics, getArticles, getArticleById };
