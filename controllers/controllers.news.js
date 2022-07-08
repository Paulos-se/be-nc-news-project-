const {
  fetchTopics,
  fetchArticleById,
  updateArticleVote,
  fetchUsers,
  fetchArticles,
  fetchComments,
  insertComment,
  checkTopicExists,
  deleteComment,
  fetchJson,
  checkId,
} = require("../models/models.news");

exports.getTopics = (req, res, next) => {
  fetchTopics().then((result) => {
    res.status(200).send({ topics: result });
  });
};

exports.getArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    await checkId(article_id);
    const result = await fetchArticleById(article_id);
    res.status(200).send({ article: result });
  } catch (err) {
    next(err);
  }
};

exports.patchArticleVote = async (req, res, next) => {
  try {
    const { inc_votes } = req.body;
    const { article_id } = req.params;
    await checkId(article_id);
    const votes = await updateArticleVote(inc_votes, article_id);
    res.status(200).send({ votes });
  } catch (err) {
    next(err);
  }
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

exports.getComments = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    await checkId(article_id);
    const comments = await fetchComments(article_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postComments = async (req, res, next) => {
  try {
    const { author, body } = req.body;
    const { article_id } = req.params;
    await checkId(article_id);
    const comment = await insertComment(article_id, body, author);
    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
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

exports.getJson = (req, res, next) => {
  fetchJson()
    .then((endpoints) => {
      res.status(200).send(endpoints);
    })
    .catch((err) => {
      next(err);
    });
};
