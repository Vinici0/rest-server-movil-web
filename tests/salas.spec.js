const requestT = require("supertest");
const {app} = require("../app");

describe("GET api/auth", () => {
  test("should return 200", async () => {
    await requestT(app).get("/api/salas").send().expect(200);
  });
});
