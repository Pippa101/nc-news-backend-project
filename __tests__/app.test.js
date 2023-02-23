const request = require("supertest");
const app = require("../app/app");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const connection = require("../db/connection.js");
const sort = require("jest-sorted");

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
  describe("/api/articles", () => {
    it("returns a 200 status : GET responds with an array of all the article objects with the relevant keys", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((articlesResponse) => {
          const articles = articlesResponse.body;
          expect(articles.length).toBe(12);

          for (let article of articles) {
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
            expect(article).toHaveProperty("comment_count", expect.any(Number));
          }
        });
    });
    it("should return 200 : GET responds with the articles in the correct order, sorted by most recent date", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((articlesResponse) => {
          const articles = articlesResponse.body;
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    it("should return 404 status : GET responds with error msg when end point does not exist yet", () => {
      return request(app).get("/api/articlez").expect(404);
    });
  });
  describe("api/articles/article:id", () => {
    it("should return 200 status : GET responds with one article object with the correct article_id", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then((articleResponse) => {
          const article = articleResponse.body;
          expect(article).toMatchObject({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    it("should return a 404 status : GET responds with an error msg when an id which does not exist but the valid datatype is used", () => {
      return request(app)
        .get("/api/articles/50")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    it("should return a 400 status : GET responds with an error msg when an invalid id is used (invalid datatype)", () => {
      return request(app)
        .get("/api/articles/LOL")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid ID");
        });
    });
  });
  describe("GET /api/articles/:articles_id/comments", () => {
    it("should return 200: GET responds with an array of all the comment objects with the correct properties belonging to the correct article", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((articleComments) => {
          const comments = articleComments.body;
          expect(comments.length).toBe(11);
          for (let comment of comments) {
            expect(comment).toHaveProperty("comment_id", expect.any(Number));
            expect(comment).toHaveProperty("votes", expect.any(Number));
            expect(comment).toHaveProperty("created_at", expect.any(String));
            expect(comment).toHaveProperty("author", expect.any(String));
            expect(comment).toHaveProperty("body", expect.any(String));
            expect(comment).toHaveProperty("article_id", 1);
          }
        });
    });
    it("should return 200: GET responds with the comments array ordered by the most recent comment first", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then((articleComments) => {
          const comments = articleComments.body;
          expect(comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    it("should return 200 : GET responds with an empty array when article_id is valid and exists, but there are no comments associated with it", () => {
      return request(app)
        .get("/api/articles/7/comments")
        .expect(200)
        .then((articleComments) => {
          const comments = articleComments.body;
          expect(comments).toMatchObject([]);
        });
    });
    it("should return 400 : GET responds with error msg: invalid ID when an invalid article id (invalid datatype) is used", () => {
      return request(app)
        .get("/api/articles/LOL/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid ID");
        });
    });
    it("should return a 404 status : GET repsonds with an error msg when nonExistant id is used (but still a valid datatype) is used", () => {
      return request(app)
        .get("/api/articles/50/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    it("should return 200 status : POST returns a comment object with the correct properties including the correct article_id", () => {
      const newComment = {
        username: "lurker",
        body: "omg can you believe it!?",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(201)
        .then((comments) => {
          expect(comments.body).toMatchObject({
            comment_id: 19,
            body: "omg can you believe it!?",
            votes: 0,
            author: "lurker",
            article_id: 3,
            created_at: expect.any(String),
          });
        });
    });
    it("should return a 404 status : POST repsonds with an error msg when an unknown id is used (but still a valid datatype) is used", () => {
      const newComment = {
        username: "lurker",
        body: "omg can you believe it!?",
      };
      return request(app)
        .post("/api/articles/50/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });

    it("should return a 400 status : POST repsonds with an error msg when an invalid id is used", () => {
      const newComment = {
        username: "lurker",
        body: "omg can you believe it!?",
      };
      return request(app)
        .post("/api/articles/LOL/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid ID");
        });
    });
  });

  it("should return a 400 status : POST repsonds with an error msg when the comment body does not include username or body properties", () => {
    const newComment = {
      OMG: "",
      thumbs: "",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid comment");
      });
  });
  it("should return a 400 status : POST repsonds with an error msg when the comment object properties contain the wrong datatypes", () => {
    const newComment = {
      username: 5,
      body: [],
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid comment");
      });
  });
  it("should return a 201 status : POST repsonds with a comment object which ignores extra properties that are not username or body", () => {
    const newComment = {
      username: "butter_bridge",
      body: "unpopular opinion but, I'm not a dog OR a cat person ... I like frogs",
      img: "frog.jpeg",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((comments) => {
        expect(comments.body).toMatchObject({
          comment_id: 19,
          body: "unpopular opinion but, I'm not a dog OR a cat person ... I like frogs",
          votes: 0,
          author: "butter_bridge",
          article_id: 1,
          created_at: expect.any(String),
        });
      });
  });
  it("shoudl return 404 status : POST responds with an error msg when the username does not exist in the database", () => {
    const newComment = {
      username: "bob",
      body: "hi I'm bob I don't have an account",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  describe("PATCH api/articles/:article_id", () => {
    it("should return 200 : PATCH updates the votes key on the correct article object by the number indicated in the request body object - checking positive", () => {
      const newVote = { inc_votes: 5 };
      return request(app)
        .patch("/api/articles/3")
        .send(newVote)
        .expect(202)
        .then((article) => {
          expect(article.body).toMatchObject({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 5,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });

    it("should return 200 : PATCH updates the votes key on the correct article object by the number indicated in the request body object -checking negative numbers", () => {
      const newVote = { inc_votes: -20 };
      return request(app)
        .patch("/api/articles/1")
        .send(newVote)
        .expect(202)
        .then((article) => {
          expect(article.body).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 80,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    it("should return 404 status : PATCH responds with an error msg when the article id does not exist (but is the correct datatype)", () => {
      const newVote = { inc_votes: 3 };
      return request(app)
        .patch("/api/articles/100")
        .send(newVote)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });

    it("should return 400: PATCH responds with an error msg when an invalid article id is used (invalid datatype)", () => {
      const newVote = { inc_votes: 3 };
      return request(app)
        .patch("/api/articles/LOL")
        .send(newVote)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid ID");
        });
    });

    it("should return 400: PATCH responds with an error msg when the req body inc_votes does not have a number value", () => {
      const newVote = { inc_votes: "rebel" };
      return request(app)
        .patch("/api/articles/3")
        .send(newVote)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("should return 200 : PATCH updates the votes key on the correct article object and ignores any extra properties", () => {
      const newVote = { inc_votes: -20, somethingExtra: "ohlala" };
      return request(app)
        .patch("/api/articles/1")
        .send(newVote)
        .expect(202)
        .then((article) => {
          expect(article.body).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 80,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
  });

  describe("GET /api/users", () => {
    it("should return 200 status : GET responds with an array of ALL user objects with username, name, avatar_url properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((usersData) => {
          const users = usersData.body;
          expect(users.length).toBe(4);
          for (let user of users) {
            expect(user).toHaveProperty("username", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("avatar_url", expect.any(String));
          }
        });
    });
    it("should return 404  status: GET responds with an error msg when the path is not found", () => {
      return request(app).get("/api/userz").expect(404);
    });
  });
});
