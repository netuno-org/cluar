import request from "supertest";
import { test, expect } from "@jest/globals";

const NETUNO_URL = "http://localhost:9000/services";

test("login with user admin", async () => {
  const response = await request(NETUNO_URL)
    .put("/_auth")
    .set("Content-Type", "application/json")
    .set("Accept", "*/*")
    .send({
      username: "admin",
      password: "admin",
      jwt: true
    })
    .expect("Content-Type", "application/json")
    .expect(200);

  expect(response.body.result).toBe(true);
  expect(response.body).toHaveProperty("access_token");
});

test("login with a user that doesn't exist", async () => {
  const response = await request(NETUNO_URL)
    .put("/_auth")
    .set("Content-Type", "application/json")
    .set("Accept", "*/*")
    .send({
      username: "notexist",
      password: "12345678",
      jwt: true
    })
    .expect("Content-Type", "application/json")
    .expect(403);

  expect(response.body.result).toBe(false);
  expect(response.body).not.toHaveProperty("access_token");
});
