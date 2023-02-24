const { query } = require("../db/connection");
const db = require("../db/connection");
const comments = require("../db/data/test-data/comments");
const format = require("pg-format");
function fetchTopics() {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
}

function fetchArticles(query) {
  let queryStr = `SELECT COUNT(comments.article_id) :: INT AS comment_count,
  articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url 
  FROM comments RIGHT OUTER JOIN articles
  ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY created_at DESC
  `;

  // if a query has been used in the URL
  if (Object.keys(query).length > 0) {
    console.log("im here");
    const queryParams = [];

    let updatedQuery = `SELECT COUNT(comments.article_id) :: INT AS comment_count,
    articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url 
    FROM comments RIGHT OUTER JOIN articles
    ON comments.article_id = articles.article_id
    `;

    if (query.topic !== undefined) {
      queryParams.push(query.topic);
      updatedQuery += ` WHERE topic = $1 GROUP BY articles.article_id `;
    } else {
      updatedQuery += ` GROUP BY articles.article_id `;
    }

    if (
      query.sort_by !== undefined &&
      !["votes", "created_at", "author", "title"].includes(query.sort_by)
    ) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    } else if (query.sort_by !== undefined) {
      updatedQuery += ` ORDER BY ${query.sort_by}`;
    } else {
      updatedQuery += ` ORDER BY created_at`;
    }

    if (
      query.order_by !== undefined &&
      !["ASC", "DESC"].includes(query.order_by)
    ) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    } else if (query.order_by !== undefined) {
      updatedQuery += ` ${query.order_by};`;
    } else {
      updatedQuery += ` DESC`;
    }

    return db.query(updatedQuery, queryParams).then((articles) => {
      console.log(updatedQuery);
      return articles.rows;
    });

    // else return the original/default queryStr
  } else {
    return db.query(queryStr).then((articles) => {
      return articles.rows;
    });
  }
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

function insertComment(newComment, article_id) {
  const { username: author, body } = newComment;

  if (
    (!author || !body || typeof author !== "string", typeof body !== "string")
  ) {
    return Promise.reject({ status: 400, msg: "Invalid comment" });
  }
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [author, body, article_id]
    )
    .then((comment) => {
      if (!comment) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return comment.rows[0];
      }
    });
}

function updateVotes(article_id, inc_votes) {
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

function fetchUsers() {
  return db.query(`SELECT * FROM users;`).then((users) => {
    return users.rows;
  });
}
module.exports = {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  updateVotes,
  insertComment,
  fetchUsers,
};
