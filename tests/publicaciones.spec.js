const { app } = require("../app");
const request = require("supertest");
const router = require("../routers/publicaciones"); // Adjust the correct path

describe("Publicaciones Router", () => {
    const token = process.env.TOKEN_TEST_AUTH; // Adjust this to retrieve the token properly

    test("Should get user's publications", async () => {
        const response = await request(app)
            .get("/api/publicaciones")
            .set("x-token", token)
            .expect(200);

        // Verify the response, e.g., response.body
    });

    test("Should get nearby publications", async () => {
        const response = await request(app)
            .get("/api/publicaciones/cercanas")
            .set("x-token", token)
            .expect(200);

        // Verify the response, e.g., response.body
    });

    test("Should like a publication", async () => {
        const publicationId = "publication_id"; // Replace with an actual publication ID
        const response = await request(app)
            .put(`/api/publicaciones/like2/${publicationId}`)
            .set("x-token", token)
            .expect(200);

        // Verify the response, e.g., response.body
    });

    // Add more tests for other endpoints as needed
});
