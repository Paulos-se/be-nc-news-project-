const {
  fetchTopics,
  fetchArticleById,
  updateArticleVote,
  fetchUsers,
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
