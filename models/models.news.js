const db = require('../db/connection');


exports.fetchTopics = () => {
    console.log("im in the fetch");
    return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
        return rows;
    })
}

exports.fetchArticleById=(id)=> {
    console.log("im in fetch by id");
    return db.query(`SELECT articles.author, articles.title, articles.article_id,articles.body,articles.topic, articles.created_at,articles.votes FROM articles WHERE articles.article_id=$1`,[id]).then(({ rows,rowCount }) => {
        if (rowCount === 0) {
            return Promise.reject();
       }
        return rows[0];
    })
}