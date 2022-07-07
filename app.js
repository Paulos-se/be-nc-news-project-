const express = require("express");
const app = express();
const {
  getTopics,
  getArticleById,
  patchArticleVote,
  getUsers,
  getArticles,
  getComments,
  postComments,
} = require("./controllers/controllers.news");
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleVote);
app.get("/api/users", getUsers);
app.get("/api/articles/", getArticles);
app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", postComments);

app.use("*", (req, res) => {
  res.status(404).send({ message: "not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

app.use((err, req, res) => {
  console.log(err);
  res.status(500).send({ message: "server error" });
});

module.exports = app;
