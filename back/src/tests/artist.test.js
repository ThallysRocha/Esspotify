import mockingoose from "mockingoose";
import { Artist } from "../models/artist";
import supertest from "supertest";
import app from "../server";
import bcrypt from "bcrypt";

describe("ARTISTS", () => {
  const mockedArtist = {
    _id: "507f191e810c19729de860ea",
    name: "Nome do cara",
    email: "name@email.com",
    country: "Brasil",
    genre: "Rock",
    image: ""
  };
  const mockedArtistPassword = "123456";

  beforeAll(async () => {
    mockedArtist.password = await bcrypt.hash(mockedArtistPassword, 10);
    mockingoose(Artist).toReturn(mockedArtist, "findOne");
    const resultsLogin = await supertest(app).post("/auth/login").send({
      email: mockedArtist.email,
      password: mockedArtistPassword,
    });
    token = resultsLogin.body.token;
  });

  afterEach(() => {
    mockingoose.resetAll();
  });
  
  let token;

  describe("EDIT ARTIST", () => {
    test("Editar bem sucedido", async () =>{
        mockingoose(Artist).toReturn(mockedArtist, "findOne");
        const newArtist = {
            ...mockedArtist,
            country: "USA",
        };

        const results = await supertest(app)
            .put("/artists/")
            .send(newArtist)
            .set("Authorization", "Bearer " + token);
        
        expect(results.statusCode).toBe(200);
        expect(results.body.country).toBe(newArtist.country);
    });

    test("Editar com falha", async () =>{
        mockingoose(Artist).toReturn(mockedArtist, "findOne");
        const newArtist = {
            ...mockedArtist,
            country: "",
        };

        const results = await supertest(app)
            .put("/artists/")
            .send(newArtist)
            .set("Authorization", "Bearer " + token);
        
        expect(results.statusCode).toBe(400);
        expect(results.body.error).toBe("You can't have empty fields");
    })
  });
});
