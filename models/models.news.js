const db = require('../db/connection');


exports.fetchTopics = () => {
    console.log("im in the fetch");
    return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
        return rows;
    })
}