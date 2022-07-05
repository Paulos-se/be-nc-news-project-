const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

const { articleData, commentData, topicData, userData } = require("../db/data/test-data/index");
const request = require("supertest");

afterAll(() => {
    if (db.end) return db.end();
});

beforeEach(() => seed({ articleData, commentData, topicData, userData }));

describe("my express project", () => {
    describe("GET:/api/topicz", () => {
        it("404 - returns page not found", () => {
            return request(app).get("/api/topicz").expect(404).then(({ body: { message } }) => {
                expect(message).toBe("not found");
                
            })
        })
    })

    describe("GET:/api/topics", () => {
        it("200- returns topics", () => {
            return request(app).get("/api/topics").expect(200).then(({ body: {topics} }) => {
                expect(topics).toHaveLength(3);
                expect(topics).toBeInstanceOf(Array);
                topics.forEach((topic) => {
                    expect(topic).toEqual(expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String)
                    }))
                    
                })
                
            })
        })
    })

    describe("GET: /api/articles/:article_id", () => {
        it("200- returns article by id", () => {
            const id = 5;
            return request(app).get(`/api/articles/${id}`).expect(200).then(({ body: { article } }) => {
                expect(article).toEqual(expect.objectContaining({
        author: expect.any(String),
        title: expect.any(String),
        article_id: 5,
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number)
      }));
                  
                
            })
        })
    })


        it("404 - returns page not found if id is not avilable", () => {
            const id = 1000;
            return request(app).get(`/api/articles/${id}`).expect(404).then(({ body: { message } }) => {
                expect(message).toBe(`article ${id} not found.`);
                
            })
        })


        it("400 - returns bad request if id is not a number", () => {
            const id = "hi";
            return request(app).get(`/api/articles/${id}`).expect(400).then(({ body: { message } }) => {
                expect(message).toBe('invalid id');
                
            })
        })
    describe("PATCH: /api/articles/:article_id", () => {
        it("200 - updates article by id", () => {
            const id = 1;
            
            return request(app).
                patch(`/api/articles/${id}`).send({ inc_votes: -5 }).expect(204).then(() => {
                    return db.query(`SELECT votes FROM articles WHERE article_id=$1`, [id]).then(({ rows }) => {
                        expect(rows[0].votes).toBe(95);
                    })
                })
        })

        it("400 - returns invalid request if request body doesn't contain vote", () => {
            const id = 5;
            return request(app).patch(`/api/articles/${id}`).send({  }).expect(400).then(({body:{message}}) => {
                expect(message).toBe("bad formatted update");
            })
                
        })
        
         it("400 - returns invalid request if request body  contain vote", () => {
            const id = 5;
            return request(app).patch(`/api/articles/${id}`).send({ inc_votes:"cat" }).expect(400).then(({body:{message}}) => {
                expect(message).toBe("invalid update");
            })
                
            })
    
    })
})

