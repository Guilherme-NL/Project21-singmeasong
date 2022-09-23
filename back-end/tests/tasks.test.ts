import app from "../src/app";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { prisma } from "../src/database";

describe("/recommendation POST", () => {
  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
  });

  it("Add a new music recommendation", async () => {
    const body = {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    const result = await supertest(app).post("/recommendations").send(body);
    const status = result.status;

    expect(status).toEqual(201);
  });

  it("Add a new music recommendation, wrong schema", async () => {
    const body = {};

    const result = await supertest(app).post("/recommendations").send(body);
    const status = result.status;

    expect(status).toEqual(422);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
