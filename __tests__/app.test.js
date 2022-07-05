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
                expect(message).toBe("Invalid path");
                
            })
        })
    })

    describe("GET:/api/topics", () => {
        it("200- this returns topics", () => {
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
})

