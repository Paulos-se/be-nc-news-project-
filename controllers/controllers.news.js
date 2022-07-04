const { fetchTopics } = require("../models/models.news");


exports.getTopics = (req, res, next) => {
    fetchTopics().then(( result) => {
        console.log(result);
        res.status(200).send({ topics:result });
    })
}