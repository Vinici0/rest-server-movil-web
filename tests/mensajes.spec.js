const { app } = require("../app");
const request = require("supertest");

describe("Mensajes Router", () => {
    const token = process.env.TOKEN_TEST_AUTH;
    const salaId = "64c1ca50a9e34350e4b40c27"; 
    test("Should get all messages", async () => {
        const response = await request(app)
            .get(`/api/mensajes/get-mensajes/${salaId}`) 
            .set("x-token", token)
            .expect(404);

        // Verify the response, e.g., response.body
    });

    test("Should get messages by user", async () => {
        const response = await request(app)
            .get("/api/mensajes/get-mensaje-by-user")
            .set("x-token", token)
            .expect(200);

        // Verify the response, e.g., response.body
    });

    test("Should get messages by room", async () => {
        const response = await request(app)
            .get(`/api/mensajes/get-mensaje-by-room/${salaId}`)
            .set("x-token", token)
            .expect(200);

        // Verify the response, e.g., response.body
    });
});
