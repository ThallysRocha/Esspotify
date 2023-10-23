import mockingoose from "mockingoose";
import supertest from "supertest";
import { Artist } from "../models/artist";
import bcrypt from "bcrypt";
import app from "../server";

describe("AUTH", () => {
  const mockedArtist = {
    _id: "507f191e810c19729de860ea",
    name: "Nome do cara",
    email: "name@email.com",
  };
  const mockedArtistPassword = "123456";

  beforeAll(async () => {
    mockedArtist.password = await bcrypt.hash(mockedArtistPassword, 10);
  });

  afterEach(() => {
    mockingoose.resetAll();
  });

  describe("LOGIN", () => {
    test("Login bem sucedido", async () => {
      mockingoose(Artist).toReturn(mockedArtist, "findOne");

      const results = await supertest(app).post("/auth/login").send({
        email: mockedArtist.email,
        password: mockedArtistPassword,
      });

      expect(results.statusCode).toBe(200);
      expect(results.body.token).toBeTruthy();
      expect(results.body.artist.name).toBe(mockedArtist.name);
    });

    test("Login mal sucedido por senha inválida", async () => {
      mockingoose(Artist).toReturn(mockedArtist, "findOne");

      const results = await supertest(app).post("/auth/login").send({
        email: mockedArtist.email,
        password: "invalidpassword",
      });

      expect(results.statusCode).toBe(400);
      expect(results.body.error).toBe("Invalid credentials");
    });

    test("Login mal sucedido por email incorreto", async () => {
      mockingoose(Artist).toReturn(null, "findOne");

      const results = await supertest(app).post("/auth/login").send({
        email: "emailinvalido@email.com",
        password: mockedArtistPassword,
      });

      expect(results.statusCode).toBe(400);
      expect(results.body.error).toBe("Invalid credentials");
    });

    test.each([
      { email: "", password: "123456", reason: "email vazio" },
      { email: mockedArtist.email, password: "", reason: "senha vazia" },
    ])("Login mal sucedido por $reason", async ({ email, password }) => {

      const results = await supertest(app).post("/auth/login").send({
        email,
        password,
      });

      expect(results.statusCode).toBe(400);
      expect(results.body.error).toBe("Invalid credentials");
    });
  });

  describe("VALIDATE TOKEN", () => {
    test("Should receive a valid token", async () => {
      mockingoose(Artist).toReturn(mockedArtist, "findOne");
      const resultsLogin = await supertest(app).post("/auth/login").send({
        email: mockedArtist.email,
        password: mockedArtistPassword,
      });

      const token = resultsLogin.body.token;

      const results = await supertest(app)
        .post("/auth/validate-token")
        .set("Authorization", "Bearer " + token);

      expect(results.statusCode).toBe(200);
      expect(results.body.userId).toBe(mockedArtist._id);
    });

    test.each([
      { token: "invalid" },
      { token: "bearer ushakushakusjh" },
      { token: "Bearer ushakushakusjh" },
    ])("Should return invalid token for token: $token", async ({ token }) => {
      const results = await supertest(app)
        .post("/auth/validate-token")
        .set("Authorization", token);

      expect(results.statusCode).toBe(401);
      expect(results.body.error).toBe("Invalid token");
    });

    test("No token provided", async () => {
      const results = await supertest(app).post("/auth/validate-token");

      expect(results.statusCode).toBe(401);
      expect(results.body.error).toBe("No token provided");
    });
  });
});
