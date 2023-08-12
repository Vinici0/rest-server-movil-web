const { app } = require("../app");
const request = require("supertest");

describe("Notificaciones Router", () => {
    const token = process.env.TOKEN_TEST_AUTH; // Adjust this to retrieve the token properly

    test("Should get user's notifications", async () => {
        const response = await request(app)
            .get("/api/notificaciones")
            .set("x-token", token)
            .expect(200);

        // Verify the response, e.g., response.body
    });

    test("Should mark notification as read", async () => {
        const notificationId = "notification_id"; // Replace with an actual notification ID
        const response = await request(app)
            .put(`/api/notificaciones/${notificationId}`)
            .set("x-token", token)
            .expect(200);

        // Verify the response, e.g., response.body
    });
});
