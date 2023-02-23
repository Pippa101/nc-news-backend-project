const { query } = require("../db/connection");
const db = require("../db/connection");
const comments = require("../db/data/test-data/comments");
const format = require("pg-format");
function fetchTopics() {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
}

function fetchArticles() {
  return db
    .query(
      `SELECT COUNT(comments.article_id) :: INT AS comment_count,
      articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url 
      FROM comments RIGHT OUTER JOIN articles
      ON comments.article_id = articles.article_id
      GROUP BY articles.article_id
      ORDER BY created_at DESC;
      `
    )
    .then((articles) => {
      return articles.rows;
    });
}

function fetchArticleById(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return article.rows[0];
      }
    });
}

function fetchCommentsByArticleId(article_id) {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then((comments) => {
      return comments.rows;
    });
}

function updateVotes(article_id, inc_votes) {
  console.log(typeof inc_votes);
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then((updatedArticle) => {
      return updatedArticle.rows[0];
    });
}

module.exports = {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  updateVotes,
};
