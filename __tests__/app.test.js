const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

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

    test("400 responds with not found when there the id is invalid", () => {
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
});
