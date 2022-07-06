const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (id) => {
  if (isNaN(parseInt(id))) {
    return Promise.reject({
      status: 400,
      message: `invalid id`,
    });
  } else {
    return db
      .query(
        `SELECT articles.*, COUNT(comments.comment_id)::INT as comment_count FROM articles JOIN comments ON comments.article_id=articles.article_id WHERE articles.article_id=$1 GROUP BY articles.article_id;`,
        [id]
      )
      .then(({ rows, rowCount }) => {
        if (rowCount === 0) {
          return Promise.reject({
            status: 404,
            message: `article ${id} not found.`,
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
  } else if (isNaN(parseInt(vote))) {
    return Promise.reject({
      status: 400,
      message: "invalid update",
    });
  } else {
    return db
      .query(
        `UPDATE articles SET votes=votes+${vote} WHERE article_id=$1 RETURNING *`,
        [id]
      )
      .then(({ rows }) => {
        return rows[0].votes;
      });
  }
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

