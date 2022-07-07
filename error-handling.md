# Possible Errors

This is an _**incomplete**_ guide to the possible errors that may happen in your app. We have left some of them blank to prompt you to think about the errors that could occur as a client uses each endpoint that you have created.

Think about what could go wrong for each route, and the HTTP status code should be sent to the client in each case.
For each thing that could go wrong, make a test with your expected status code and then make sure that possibility is handled.

Bear in mind, handling bad inputs from clients doesn't necessarily have to lead to a 4\*\* status code. Handling can include using default behaviours or even ignoring parts of the request.

---

## Relevant HTTP Status Codes

- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 404 Not Found
- 405 Method Not Allowed
- 418 I'm a teapot
- 422 Unprocessable Entity
- 500 Internal Server Error

---

## The Express Documentation

[The Express Docs](https://expressjs.com/en/guide/error-handling.html) have a great section all about handling errors in Express.

## Unavailable Routes

### GET `/not-a-route`

- Status: ???

---

## Available Routes

### GET `/api/topics`

-

### GET `/api/users/:username`

-

### GET `/api/articles/:article_id`

- Bad `article_id` (e.g. `/dog`)
- Well formed `article_id` that doesn't exist in the database (e.g. `/999999`)

### PATCH `/api/articles/:article_id`

- No `inc_votes` on request body
- Invalid `inc_votes` (e.g. `{ inc_votes : "cat" }`)

### POST `/api/articles/:article_id/comments`

-

### GET `/api/articles/:article_id/comments`

-

### GET `/api/articles`

- Bad queries:
  - `sort_by` a column that doesn't exist
  - `order` !== "asc" / "desc"
  - `topic` that is not in the database
  - `topic` that exists but does not have any articles associated with it

### PATCH `/api/comments/:comment_id`

-

### DELETE `/api/comments/:comment_id`

-

### GET `/api`

-

Responds with:

an articles array of article objects, each of which should have the following properties:

1 author which is the
username from the users table

2 title

3 article_id

4 topic

5 created_at

6 votes

7 comment_count which is the total count of all the comments with this article_id -

you should make use of queries to the database in order to achieve this.
the articles should be sorted by date in descending order.

Errors to Consider - add errors to handle as items to the checklist

9. GET /api/articles/:article_id/comments

Description
Edit
Responds with:

an array of comments for the given article_id of which each comment should have the following properties:

-comment_id

-votes

-created_at

-author which is the username from the users table

-body

Errors to Consider - add errors to handle as items to the checklist

10. POST /api/articles/:article_id/comments

Request body accepts:

an object with the following properties:
--username

--body

Responds with:

the posted comment

Errors to Consider - add errors to handle as items to the checklist
