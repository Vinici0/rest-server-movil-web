const { app } = require("../app");
const request = require("supertest");

describe("Comments API Testing api/comentarios", () => {
    const token = process.env.TOKEN_TEST_AUTH;
  
    const commentData = {
        contenido:"sala1",
        publicacionId:"64c2dc5184c4d0f0c9062ef0" 
    };
  
    test("Should retrieve comments by publication ID", async () => {
      await request(app)
        .get("/api/comentarios/64d17088e27ea53f578d106c")
        .set("x-token", token)
        .expect(200);
    });
  
    test("Should successfully create a new comment", async () => {
      const response = await request(app)
        .post("/api/comentarios")
        .set("x-token", token)
        .send(commentData)
        .expect(201);
    });
  
    test("Should successfully like a comment", async () => {
      await request(app)
        .put("/api/comentarios/like/64d17088e27ea53f578d106c")
        .set("x-token", token)
        .expect(200);
    });
  });
  