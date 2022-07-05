const db = require('../db/connection');

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
        return rows;
    })
}

exports.fetchArticleById = (id) => {
    

    if (isNaN(parseInt(id))) {
        return Promise.reject({
            status: 400,
            message: `invalid id`
        });
    } else {

        return db.query(`SELECT articles.author, articles.title, articles.article_id,articles.body,articles.topic, articles.created_at,articles.votes FROM articles WHERE articles.article_id=$1`, [id]).then(({ rows, rowCount }) => {
            if (rowCount === 0) {
                return Promise.reject({
                    status: 404,
                    message: `article ${id} not found.`
                });
            }
            return rows[0];
        })
    
    }
}