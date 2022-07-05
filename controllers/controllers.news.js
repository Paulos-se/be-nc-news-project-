<<<<<<< HEAD
const { fetchTopics } = require("../models/models.news");


exports.getTopics = (req, res, next) => {
    fetchTopics().then(( topics) => {
        res.status(200).send({ topics});
    })
}
=======
>>>>>>> 24301a7e1693879cca0ae599af33733c1dc6bc3b
