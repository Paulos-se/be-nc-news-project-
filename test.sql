\c nc_news_test


SELECT * FROM topics;
SELECT * FROM users;
SELECT * FROM articles;
SELECT * FROM comments;


SELECT articles.*, COUNT(comments.comment_id) as comment_count FROM articles JOIN comments ON comments.article_id=articles.article_id WHERE articles.article_id=1 GROUP BY articles.article_id;

--TASK8
SELECT articles.author,articles.title, articles.article_id,articles.topic,articles.created_at,articles.votes, COUNT(comments.comment_id) as comment_count FROM articles JOIN comments ON comments.article_id=articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;

--TASK9
SELECT comments.comment_id,comments.body,comments.votes,comments.created_at,comments.author FROM comments JOIN articles ON comments.article_id=articles.article_id WHERE articles.article_id=1;


-- psql -f ./test.sql>