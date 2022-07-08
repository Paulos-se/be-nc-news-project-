const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const express = require("express");
app.use(express.json());
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const request = require("supertest");

afterAll(() => {
  if (db.end) return db.end();
});

beforeEach(() => seed({ articleData, commentData, topicData, userData }));

describe("my express project", () => {
  describe("GET:/api/topicz", () => {
    it("404 - returns page not found", () => {
      return request(app)
        .get("/api/topicz")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("not found");
        });
    });
  });

  describe("GET:/api/topics", () => {
    it("200- returns topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3);
          expect(topics).toBeInstanceOf(Array);
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });

  describe("GET: /api/articles/:article_id", () => {
    it("200- returns article by id", () => {
      const id = 5;
      return request(app)
        .get(`/api/articles/${id}`)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: 5,
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });

    it("200- returns article by id (comment_count)", () => {
      const id = 1;
      return request(app)
        .get(`/api/articles/${id}`)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: 1,
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: 11,
            })
          );
        });
    });

    it("200- returns article by id (comment_count)", () => {
      const id = 2;
      return request(app)
        .get(`/api/articles/${id}`)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: 2,
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: 0,
            })
          );
        });
    });

    it("404 - returns page not found if id is not avilable GET /api/articles/99999", () => {
      const id = 9999;
      return request(app)
        .get(`/api/articles/${id}`)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe(`article ${id} not found.`);
        });
    });

    it("400 - returns bad request if id is not a number GET /api/articles/not-an-id", () => {
      const id = "not-an-id";
      return request(app)
        .get(`/api/articles/${id}`)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("invalid id");
        });
    });
  });
  describe("PATCH: /api/articles/:article_id", () => {
    const id = 1;
    it("200 - updates article by id", () => {
      return request(app)
        .patch(`/api/articles/${id}`)
        .send({ inc_votes: -5 })
        .expect(200)
        .then(() => {
          return db
            .query(`SELECT votes FROM articles WHERE article_id=$1`, [id])
            .then(({ rows }) => {
              expect(rows[0].votes).toBe(95);
            });
        });
    });

    it("400 - returns invalid request if request body doesn't contain vote", () => {
      const id = 5;
      return request(app)
        .patch(`/api/articles/${id}`)
        .send({})
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("bad formatted update");
        });
    });

    it("400 - returns invalid request if request body  invalid contain vote", () => {
      const id = 5;
      return request(app)
        .patch(`/api/articles/${id}`)
        .send({ inc_votes: "cat" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("invalid update");
        });
    });
  });

  describe("GET:/api/userz", () => {
    it("404 - returns page not found", () => {
      return request(app)
        .get("/api/userz")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("not found");
        });
    });
  });

  describe("GET: /api/users", () => {
    it("200 returns users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4);
          expect(users).toBeInstanceOf(Array);
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });

  describe("GET:/api/articlez", () => {
    it("404 - returns page not found", () => {
      return request(app)
        .get("/api/articlez")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("not found");
        });
    });
  });

  describe("GET: /api/articles", () => {
    it("200 returns articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeInstanceOf(Array);
          expect(articles.length).toBeGreaterThan(0);
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });

    it("200 returns articles sorted by created_at", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });

    it("200 sort_by, which sorts the articles by any valid column (defaults to date)", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("votes", { descending: true });
        });
    });

    it("200 order, which orders articles in default order", () => {
      return request(app)
        .get("/api/articles")
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });

    it("200 order, which orders articles in specified order", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at");
        });
    });

    it("200 order, which sorts the articles by any valid column (defaults to date)order(defaults to descending)", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("title");
        });
    });

    it("400 sort_by, responds with bad request if sort column is invalid)", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_id&order=desc")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("invalid sort request");
        });
    });

    it("400 order, responds with bad request if order is invalid)", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=high")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("invalid order request");
        });
    });

    it("400 sort_by, responds with bad request if sort column and sort order is invalid", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_id&order=higher")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("invalid sort request");
        });
    });

    it("200 filter by topic, responds with articles with the filter topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(11);
          expect(articles).toBeInstanceOf(Array);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                author: expect.any(String),
                votes: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });

    it("200 filter by topic, accepts a valid filter topic with no articles", () => {
      return request(app)
        .get("/api/articles")
        .query({ topic: "paper" })
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(0);
          expect(articles).toBeInstanceOf(Array);
        });
    });

    it("404 responds with topic not found error when topic doesn't exist", () => {
      const topic = "stone";
      return request(app)
        .get("/api/articles")
        .query({ topic: topic })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe(`Topic ${topic} not found`);
        });
    });
  });

  describe("GET /api/articles/:article_id/comments", () => {
    it("200 responds with:an array of comments for the given article_id", () => {
      const id = 2;
      return request(app)
        .get(`/api/articles/${id}/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeInstanceOf(Array);
          expect(comments).toHaveLength(0);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          });
        });
    });

    test("404 responds with not found when there is no id", () => {
      const id = 100;
      return request(app)
        .get(`/api/articles/${id}/comments`)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe(`Article ID ${id} does not exist.`);
        });
    });

    test("400 responds with not found when the id is invalid", () => {
      const id = "not-valid";
      return request(app)
        .get(`/api/articles/${id}/comments`)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(`Article ID is not valid.`);
        });
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    it("200 responds with the posted comment", () => {
      const id = 2;
      return request(app)
        .post(`/api/articles/${id}/comments`)
        .send({ author: "rogersop", body: "new comment" })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual(
            expect.objectContaining({
              author: "rogersop",
              body: "new comment",
            })
          );
        });
    });

    test("404 responds with not found when there is no id", () => {
      const id = 100;
      return request(app)
        .post(`/api/articles/${id}/comments`)
        .send({ author: "rogersop", body: "new comment" })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe(`Article ID ${id} does not exist.`);
        });
    });

    it("400 responds with not valid when the id is invalid", () => {
      const id = "not-valid";
      return request(app)
        .post(`/api/articles/${id}/comments`)
        .send({ author: "rogersop", body: "new comment" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(`Article ID is not valid.`);
        });
    });

    it("400 responds with bad request when post malformatted", () => {
      const id = 2;
      return request(app)
        .post(`/api/articles/${id}/comments`)
        .send({ body: "new comment" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("bad formatted post");
        });
    });

    it("400 responds with invalid key when key constraint not met", () => {
      const id = 2;
      return request(app)
        .post(`/api/articles/${id}/comments`)
        .send({ author: "jonny", body: "new comment" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("invalid key");
        });
    });
  });

  describe("DELETE: /api/comments/:comment_id", () => {
    it("204 deletes given comment by comment_id", () => {
      const id = 4;
      return request(app)
        .delete(`/api/comments/${id}`)
        .expect(204)
        .then(() => {
          return db
            .query(`SELECT comment_id FROM comments WHERE comment_id=$1`, [id])
            .then(({ rows }) => {
              expect(rows.length).toBe(0);
            });
        });
    });

    it("404 responds with comment id  does not exist when it doesn't", () => {
      const id = 19;
      return request(app)
        .delete(`/api/comments/${id}`)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe(`comment ${id} does not exist`);
        });
    });

    it("400 responds with bad request when comment id isn't valid", () => {
      const id = "invalid";
      return request(app)
        .delete(`/api/comments/${id}`)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(`invalid comment id`);
        });
    });
  });

  describe("GET /api", () => {
    it("200 responds with a json describing all available endpoints", () => {
      const endpoints = {
        "GET /api": {
          description:
            "serves up a json representation of all the available endpoints of the api",
        },
        "GET /api/topics": {
          description: "serves an array of all topics",
          queries: [],
          exampleResponse: {
            topics: [{ slug: "football", description: "Footie!" }],
          },
        },
        "GET /api/articles": {
          description: "serves an array of all topics",
          queries: ["author", "topic", "sort_by", "order"],
          exampleResponse: {
            articles: [
              {
                title: "Seafood substitutions are increasing",
                topic: "cooking",
                author: "weegembump",
                body: "Text from the article..",
                created_at: 1527695953341,
              },
              {
                title: "Eight pug gifs that remind me of mitch",
                topic: "mitch",
                author: "icellusedkars",
                body: "some gifs",
                created_at: 1604394720000,
                votes: 0,
              },
            ],
          },
        },
        "GET /api/users": {
          description: "serves an array of all users",
          queries: [],
          exampleResponse: {
            users: [
              {
                username: "butter_bridge",
                name: "jonny",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
              },
              {
                username: "icellusedkars",
                name: "sam",
                avatar_url:
                  "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
              },
              {
                username: "rogersop",
                name: "paul",
                avatar_url:
                  "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
              },
              {
                username: "lurker",
                name: "do_nothing",
                avatar_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              },
            ],
          },
        },
        "GET /api/articles/:article_id": {
          description: "serves an article object",
          queries: [],
          exampleResponse: {
            articles: {
              title: "Seafood substitutions are increasing",
              topic: "cooking",
              author: "weegembump",
              body: "Text from the article..",
              created_at: 1527695953341,
              article_id: 12,
              votes: 0,
              comment_count: 5,
            },
          },
        },
        "PATCH /api/articles/:article_id": {
          description: "serves an updated article object",
          queries: [],
          exampleResponse: {
            articles: {
              title: "Seafood substitutions are increasing",
              topic: "cooking",
              author: "weegembump",
              body: "Text from the article..",
              created_at: 1527695953341,
              article_id: 12,
              votes: 1,
            },
          },
        },
        "GET /api/articles/:article_id/comments": {
          description: "serves a new comment object by article id",
          queries: [],
          exampleResponse: {
            articles: {
              title: "Seafood substitutions are increasing",
              topic: "cooking",
              author: "weegembump",
              body: "Text from the article..",
              created_at: 1527695953341,
              article_id: 12,
              votes: 1,
            },
          },
        },
        "POST /api/articles/:article_id/comments": {
          description: "posts and serves a new comment object by article id",
          queries: [],
          exampleResponse: {
            articles: {
              title: "Seafood substitutions are increasing",
              topic: "cooking",
              author: "weegembump",
              body: "Text from the article..",
              created_at: 1527695953341,
              article_id: 12,
              votes: 1,
            },
          },
        },
        "DELETE /api/comments/:comment_id": {
          description: "deletes a comment by comment id",
          queries: [],
          exampleResponse: {
            comments: [],
          },
        },
      };
      return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual(endpoints);
        });
    });
  });
});
