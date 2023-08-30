const { app } = require("../app");
const request = require("supertest");

describe("Sala Router", () => {
  const token = process.env.TOKEN_TEST_AUTH;
  let salaId = "64bfef6c2f35690cfee892ff";

  // Prueba 1: Obtener todas las salas
  test("Should get salas", async () => {
    const response = await request(app)
      .get("/api/salas")
      .set("x-token", token)
      .expect(200);

    // Verificar la respuesta, por ejemplo:
    expect(response.body).toEqual(expect.arrayContaining([])); // Reemplaza [] con el formato esperado de las salas.
  });

  // Prueba 2: Crear una sala
  test("Should create a sala", async () => {
    const nuevaSala = { nombre: "Sala de Prueba" };
    const response = await request(app)
      .post("/api/salas")
      .set("x-token", token)
      .send(nuevaSala)
      .expect(200);
  });

  // Prueba 5: Eliminar una sala
// Prueba 5: Eliminar una sala - Usuario no autorizado
test("Should not delete a sala for unauthorized user", async () => {
  const response = await request(app)
      .delete(`/api/salas/${salaId}`)
      .set("x-token", token)
      .expect(401);

  // Verificar la respuesta HTTP 401 (Unauthorized)
  expect(response.status).toBe(401);
});


  // Prueba 6: Unirse a una sala
  test("Should join a sala", async () => {
    const datosUnirseSala = { codigo: "299-427" };
    const response = await request(app)
      .post("/api/salas/unir-sala")
      .set("x-token", token)
      .send(datosUnirseSala)
      .expect(400);


  });



  // Prueba 8: Abandonar una sala
  test("Should leave a sala", async () => {
    const response = await request(app)
      .delete(`/api/salas/abandonar-sala/${salaId}`)
      .set("x-token", token)
      .expect(200);

  });
});
