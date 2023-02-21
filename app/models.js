const { query } = require("../db/connection");
const db = require("../db/connection");
const comments = require("../db/data/test-data/comments");

function fetchTopics() {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
}
// -Select everything from the articles table -tick
//-order the data by year (newest first) -tick
//- create a comment count - refers to comment objects with relevant article id.

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

module.exports = { fetchTopics, fetchArticles };
