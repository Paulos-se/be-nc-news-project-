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
        `SELECT articles.*,count(comments.article_id)::INT as comment_count FROM articles left JOIN comments ON comments.article_id=articles.article_id WHERE articles.article_id=$1 GROUP BY articles.article_id;`,
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

exports.fetchArticles = (sort_by = "created_at", order = "DESC", filter_by) => {
  const validSorts = [
    "article_id",
    "comment_count",
    "title",
    "author",
    "created_at",
    "votes",
  ];
  const order_by = order.toUpperCase();
  const validOrder = ["ASC", "DESC"];

  let queryValue = [];
  let queryString = `SELECT articles.*,count(comments.article_id)::INT as comment_count FROM articles left JOIN comments ON comments.article_id=articles.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order_by};`;

  if (filter_by) {
    queryValue.push(filter_by);
    queryString = `SELECT articles.article_id,articles.title,articles.author,articles.votes,articles.topic,articles.created_at,count(comments.article_id)::INT as hello_yoyo FROM articles left JOIN comments ON comments.article_id=articles.article_id WHERE topic=$1 GROUP BY articles.article_id  ORDER BY ${sort_by} ${order}`;
  }

  if (!validSorts.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      message: "invalid sort request",
    });
  } else if (!validOrder.includes(order_by)) {
    return Promise.reject({
      status: 400,
      message: "invalid order request",
    });
  } else {
    return db.query(queryString, queryValue).then(({ rows }) => {
      return rows;
    });
  }
};

exports.fetchComments = (id) => {
  if (isNaN(parseInt(id))) {
    return Promise.reject({
      status: 400,
      message: `Article ID is not valid.`,
    });
  }
  return db
    .query(`SELECT article_id FROM articles WHERE article_id=$1`, [id])
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: `Article ID ${id} does not exist.`,
        });
      }
      return rows[0].article_id;
    })
    .then((checked_id) => {
      return db
        .query(
          `SELECT comments.comment_id,comments.votes,comments.created_at,comments.author,comments.body FROM comments LEFT JOIN articles ON articles.article_id=comments.article_id WHERE comments.article_id=$1`,
          [checked_id]
        )
        .then(({ rows }) => {
          return rows;
        });
    });
};

exports.insertComment = (id, body, author) => {
  if (isNaN(parseInt(id))) {
    return Promise.reject({
      status: 400,
      message: `Article ID is not valid.`,
    });
  }
  if (!author || !body) {
    return Promise.reject({
      status: 400,
      message: "bad formatted post",
    });
  }
  return db
    .query(`SELECT article_id FROM articles WHERE article_id=$1`, [id])
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: `Article ID ${id} does not exist.`,
        });
      }
      return rows[0].article_id;
    })
    .then((checked_id) => {
      return db
        .query(
          `INSERT INTO comments (body,article_id,author)VALUES($1,$2,$3) RETURNING *`,
          [body, checked_id, author]
        )
        .then(({ rows }) => {
          return rows[0];
        });
    });
};

exports.deleteComment = (id) => {
  if (isNaN(parseInt(id))) {
    return Promise.reject({
      status: 400,
      message: `invalid comment id`,
    });
  }

  `invalid comment id`;
  return db
    .query(`DELETE FROM comments WHERE comment_id=$1 RETURNING *`, [id])
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: `comment ${id} does not exist`,
        });
      }
      return rows[0];
    });
};

exports.checkTopicExists = (topic) => {
  if (!topic) return;
  return db
    .query(`SELECT * FROM topics WHERE slug=$1`, [topic])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: `Topic ${topic} not found`,
        });
      }
    });
};
