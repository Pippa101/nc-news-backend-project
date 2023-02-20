const request = require("supertest");
const app = require("../app/app");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const connection = require("../db/connection.js");

afterAll(() => connection.end());
beforeEach(() => seed(testData));

describe("app", () => {
  describe("/api", () => {
    it("should return a 200 : GET responds with server ok message", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body.msg).toBe("server working");
        });
    });
  });
  describe("/api/topics", () => {
    it("should return a 200 status : GET responds with an array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual([
            {
              description: "The man, the Mitch, the legend",
              slug: "mitch",
            },
            {
              description: "Not dogs",
              slug: "cats",
            },
            {
              description: "what books are made of",
              slug: "paper",
            },
          ]);
        });
    });
    it("should return 404 status : GET responds with error msg when end point does not exist yet", () => {
      return request(app).get("/api/banana").expect(404);
    });
  });
});
