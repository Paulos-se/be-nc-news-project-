const db = require("../db/connection");
const fs = require("fs/promises");
const { updateArticleVote } = require("../models/models.news");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (id) => {
  if (isNaN(Number(id))) {
    return Promise.reject({
      status: 400,
      message: `invalid key`,
    });
  } else {
    return db
      .query(
        `SELECT articles.*,COUNT(comments.article_id)::INT as comment_count FROM articles LEFT JOIN comments ON comments.article_id=articles.article_id WHERE articles.article_id=$1 GROUP BY articles.article_id;`,
        [id]
      )
      .then(({ rows, rowCount }) => {
        if (rowCount === 0) {
          return Promise.reject({
            status: 404,
            message: `article ${id} doesn't exist`,
          });
        }
        return rows[0];
      });
  }
};

exports.updateArticleVote = (vote, id) => {
  if (!vote) {
    return Promise.reject({
      status: 400,
      message: "bad formatted update",
    });
  } else if (isNaN(Number(id))) {
    return Promise.reject({
      status: 400,
      message: `invalid id`,
    });
  } else if (isNaN(Number(vote))) {
    return Promise.reject({
      status: 400,
      message: `invalid update`,
    });
  } else {
    return db
      .query(
        `UPDATE articles SET votes=votes+${vote} WHERE article_id=$1 RETURNING *`,
        [id]
      )
      .then(({ row, rowCount }) => {
        if (rowCount === 0) {
          return Promise.reject({
            status: 404,
            message: `article ${id} doesn't exist`,
          });
        }
        return row[0].votes;
      });
  }
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};
