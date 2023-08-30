const { app } = require("../app");
const request = require("supertest");

describe("Ubicaciones Router", () => {
    const token = process.env.TOKEN_TEST_AUTH; // Adjust this to retrieve the token properly

    const dataUbicacion = {
        "latitud": -0.252175,
        "longitud": -79.1881,
        "barrio": "Calle Cuba",
        "parroquia": "Luz de América",
        "ciudad": "Santo Domingo de los Tsáchilas",
        "pais": "Ecuador",
        "referencia": "Parroquia Luz De América",
    }

    test("Should get all locations", async () => {
        const response = await request(app)
            .get("/api/ubicaciones")
            .expect(200);

        // Verify the response, e.g., response.body
    });

    test("Should create a new location", async () => {


        const response = await request(app)
            .post("/api/ubicaciones")
            .set("x-token", token)
            .send(dataUbicacion)
            .expect(200);

        // Verify the response, e.g., response.body
    });

    test("Should get user's locations", async () => {
        const response = await request(app)
            .get("/api/ubicaciones")
            .set("x-token", token)
            .expect(200);
    });

    test("Should add a location", async () => {
        const locationId = "64c3bb741d3d977b018a30ca"; // Replace with an actual location ID
        const response = await request(app)
            .put(`/api/ubicaciones/${locationId}`)
            .set("x-token", token)
            .send(dataUbicacion)
            .expect(200);
    });

    test("Should delete a location", async () => {
        const locationId = "64c3bb741d3d977b018a30ca"; // Replace with an actual location ID
        const response = await request(app)
            .delete(`/api/ubicaciones/${locationId}`)
            .set("x-token", token)
            .expect(200);
            
        // Verify the response, e.g., response.body
    });
});
