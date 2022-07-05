const { fetchTopics,fetchArticleById } = require("../models/models.news");


exports.getTopics = (req, res, next) => {
    fetchTopics().then(( result) => {
        res.status(200).send({ topics:result });
    })
}

exports.getArticleById = (req,res,next) => {
    const { article_id } = req.params;
   
    fetchArticleById(article_id).then((result) => {
        res.status(200).send({ article: result });
    }).catch((err) => {
        // console.log(err);
        next(err);
    })
}