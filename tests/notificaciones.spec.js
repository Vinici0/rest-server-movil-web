const { app } = require("../app");
const request = require("supertest");

describe("Notificaciones Router", () => {
    const token = process.env.TOKEN_TEST_AUTH; // Adjust this to retrieve the token properly

    test("Should get user's notifications", async () => {
        const response = await request(app)
            .get("/api/notificacion")
            .set("x-token", token)
            .expect(200);

        // Verify the response, e.g., response.body
    });

    test("Should mark notification as read", async () => {
        const notificationId = "64bfef6c2f35690cfee892ff"; // Replace with an actual notification ID
        const response = await request(app)
            .put(`/api/notificacion/${notificationId}`)
            .set("x-token", token)
            .expect(404);

        // Verify the response, e.g., response.body
    });
});
