4. GET /api/articles/:article_id

Responds with:

an article object, which should have the following properties:

author which is the username from the users table
title
article_id
body
topic
created_at
votes

5. PATCH /api/articles/:article_id

Request body accepts:

an object in the form { inc_votes: newVote }

newVote will indicate how much the votes property in the database should be updated by
e.g.

{ inc_votes : 1 } would increment the current article's vote property by 1

{ inc_votes : -100 } would decrement the current article's vote property by 100

Responds with:

the updated article

6. GET /api/users

Responds with:

an array of objects, each object should have the following property:
username
name
avatar_url

7. GET /api/articles/:article_id (comment count)

**FEATURE REQUEST**
An article response object should also now include:

-`comment_count` which is the total count of all the comments with this article_id - you should make use of queries to the database in order to achieve this.

8. GET /api/articles

Responds with:

- an `articles` array of article objects, each of which should have the following properties:

  - `author` which is the `username` from the users table
  - `title`
  - `article_id`
  - `topic`
  - `created_at`
  - `votes`
  - `comment_count` which is the total count of all the comments with this article_id - you should make use of queries to the database in order to achieve this.

- the articles should be sorted by date in descending order.

Errors to Consider - add errors to handle as items to the checklist

9. GET /api/articles/:article_id/comments

Responds with:

an array of comments for the given article_id of which each comment should have the following properties:

comment_id

votes

created_at

author which is the username from the users table
body

10. POST /api/articles/:article_id/comments

Request body accepts:

an object with the following properties:

-username

-body

Responds with:

the posted comment
Errors to Consider - add errors to handle as items to the checklist

11. GET /api/articles (queries)

FEATURE REQUEST
The end point should also accept the following queries:

sort_by, which sorts the articles by any valid column (defaults to date)
order, which can be set to asc or desc for ascending or descending (defaults to descending)
topic, which filters the articles by the topic value specified in the query
Errors to Consider - add errors to handle as items to the checklist

12. DELETE /api/comments/:comment_id

DELETE /api/comments/:comment_id
Should:

delete the given comment by comment_id
Responds with:

status 204 and no content
Errors to Consider - add errors to handle as items to the checklist

13. GET /api

Responds with:

JSON describing all the available endpoints on your API, see the endpoints.json for an (incomplete) example that you could build on, or create your own from scratch!
Activity

14. Host app

Let's give the public what they want! Time to host v1 of our app!

Follow the instructions in hosting.md.

Make sure you remove the hosting.md file once you accomplished this.

15. Complete README

Nearly there!

The README is targeted at people who will come to your repo (potentially from your CV or portfolio website). They'll want to see what you have created and try it out for themselves(not just to look at your code!).

You should consider the person reading your README is another developer and so you can use high level language to describe your project

You should include the following:

-Link to hosted version
-A summary of what the project is
-Provide clear instructions of how to clone, install dependencies, -seed local database, and run tests
-Include information about how to create the two .env files
-Specify minimum versions of Node.js and Postgres needed to run the project
