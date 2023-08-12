const { app } = require("../app");
const request = require("supertest");
const router = require("../routers/ubicaciones"); // Adjust the correct path

describe("Ubicaciones Router", () => {
    const token = process.env.TOKEN_TEST_AUTH; // Adjust this to retrieve the token properly

    test("Should get all locations", async () => {
        const response = await request(app)
            .get("/api/ubicaciones")
            .expect(200);

        // Verify the response, e.g., response.body
    });

    test("Should create a new location", async () => {
        const locationData = {
            // Fill in the location data
        };

        const response = await request(app)
            .post("/api/ubicaciones")
            .set("x-token", token)
            .send(locationData)
            .expect(200);

        // Verify the response, e.g., response.body
    });

    test("Should get user's locations", async () => {
        const response = await request(app)
            .get("/api/ubicaciones")
            .set("x-token", token)
            .expect(200);

        // Verify the response, e.g., response.body
    });

    test("Should add a location", async () => {
        const locationId = "location_id"; // Replace with an actual location ID
        const response = await request(app)
            .put(`/api/ubicaciones/${locationId}`)
            .set("x-token", token)
            .expect(200);

        // Verify the response, e.g., response.body
    });

    test("Should delete a location", async () => {
        const locationId = "location_id"; // Replace with an actual location ID
        const response = await request(app)
            .delete(`/api/ubicaciones/${locationId}`)
            .set("x-token", token)
            .expect(200);

        // Verify the response, e.g., response.body
    });
});
