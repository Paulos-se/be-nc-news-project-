const express = require("express");
const app = (express());
const { getTopics } = require("./controllers/controllers.news");
app.use(express.json());

app.get("/api/topics", getTopics);







module.exports = app;