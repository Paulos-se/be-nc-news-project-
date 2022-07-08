const {
  fetchTopics,
  fetchArticleById,
  updateArticleVote,
  fetchUsers,
  fetchArticles,
  fetchComments,
  insertComment,
  checkTopicExists,
} = require("../models/models.news");

exports.getTopics = (req, res, next) => {
  fetchTopics().then((result) => {
    res.status(200).send({ topics: result });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((result) => {
      res.status(200).send({ article: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVote = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  updateArticleVote(inc_votes, article_id)
    .then((votes) => {
      res.status(200).send({ votes });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getArticles = async (req, res, next) => {
  try {
    const { sort_by, order, topic } = req.query;
    const articles = await fetchArticles(sort_by, order, topic);
    await checkTopicExists(topic);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComments = (req, res, next) => {
  const { author, body } = req.body;
  const { article_id } = req.params;
  insertComment(article_id, body, author)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};
