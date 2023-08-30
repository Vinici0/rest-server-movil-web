const { app } = require("../app");
const request = require("supertest");

describe("Publicaciones Router", () => {
    const token = process.env.TOKEN_TEST_AUTH;

    test("Should get user's publications", async () => {
        const response = await request(app)
            .get("/api/publicacion")
            .set("x-token", token)
            .expect(200);

        // Verify the response, e.g., response.body
    });

    test("Should get nearby publications", async () => {
        const response = await request(app)
            .get("/api/publicacion/cercanas")
            .set("x-token", token)
            .expect(200);

        // Verify the response, e.g., response.body
    });


    test("Should get nearby publications", async () => {
        const response = await request(app)
            .get("/api/publicacion/cercanas")
            .set("x-token", token)
            .expect(200);

        // Verify the response, e.g., response.body
    });

    // Add more tests for other endpoints as needed
});
