const { fetchTopics } = require("../models/models.news");


exports.getTopics = (req, res, next) => {
    console.log("im in controller")
    fetchTopics().then(( result) => {
        console.log(result);
        res.status(200).send({ topics:result });
    })
}