const { app } = require("../app");
const request = require("supertest");

describe("GET api/auth", () => {
  const user = {
    nombre: "vinicio",
    email: "testadadaawdwdawdadw1@gmail.com",
    password: "123456",
  };

  test("should return 200 for user login", async () => {
    await request(app)
        .post("/api/login")
        .send({
            email: user.email,
            password: user.password
        })
        .expect(200);
});

  test("should return 400", async () => {
    await request(app)
      .post("/api/login/new") 
      .send(user)
      .expect(400);
  });

  test("should return 200 for token renewal", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NGQ1ZmE2MWVmNDYwYTVjMjc0YjIyNTYiLCJpYXQiOjE2OTE3NDQ4NjYsImV4cCI6MTcyMzMwMjQ2Nn0.fvfV1wrdJBXKp7Tr_hwM51yJoLaerinnCehjg6fGdiM"; // Reemplaza con un token válido
    await request(app)
      .get("/api/login/renew")
      .set("x-token", token)
      .expect(200);
  });


});
