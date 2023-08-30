const { app } = require("../app");
const request = require("supertest");

describe("Usuarios Router", () => {
    const token = process.env.TOKEN_TEST_AUTH; // Adjust this to retrieve the token properly

    test("Should delete a phone number", async () => {
        const response = await request(app)
            .delete("/api/usuarios/delete-telefono")
            .set("x-token", token)
            .expect(400);

        // Verify the response, e.g., response.body
    });

    test("Should get users", async () => {
        const response = await request(app)
            .get("/api/usuarios")
            .set("x-token", token)
            .expect(200);

        // Verify the response, e.g., response.body
    });

    // Add more tests for other endpoints as needed
});
