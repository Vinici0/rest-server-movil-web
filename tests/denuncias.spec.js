const { app } = require("../app");
const request = require("supertest");

describe("Denuncias Router", () => {
  const token = process.env.TOKEN_TEST_AUTH;

  const denunciaData = {
    publicacionId: "64c2d5ec84c4d0f0c9062d14",
    motivo: "Inappropriate content",
  };

  test("Should successfully submit a denuncia", async () => {
    const denunciaExistente = true;

    const response = await request(app)
      .post("/api/denuncias")
      .set("x-token", token)
      .send(denunciaData);

    expect(response.body.ok).toBe(false);
    expect(response.body.msg).toBe(
      "Ya has denunciado esta publicación anteriormente"
    );
  });

  test("Should return 'not found' error for non-existing publication", async () => {
    const publicacionId = "non_existing_id";
    const denunciaData = {
      publicacionId,
      motivo: "Inappropriate content",
    };

    const response = await request(app)
      .post("/api/denuncias")
      .set("x-token", token)
      .send(denunciaData)
      .expect(500);
  });
});
