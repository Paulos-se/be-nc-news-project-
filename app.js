const express = require("express");
const app = (express());
const { getTopics } = require("./controllers/controllers.news");
app.use(express.json());

app.get("/api/topics", getTopics);

app.use("*", (req, res) => {
    res.status(404).send({message:"Invalid path"})
})



app.use((err, req,res) =>{
    res.status(500).send({ message: "server error" });
})

module.exports = app;