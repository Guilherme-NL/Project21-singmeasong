import app from "../src/app";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { prisma } from "../src/database";
import recommendationFactory from "./factories/recommendationFactory";

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

describe("/recommendation/id/upvote POST", () => {
  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
  });

  it("Add point to a music recommendation", async () => {
    const body = {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    const { id } = await recommendationFactory(body.name, body.youtubeLink);

    const result = await supertest(app).post(`/recommendations/${id}/upvote`);
    const status = result.status;

    expect(status).toEqual(200);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});

describe("/recommendation/id/downvote POST", () => {
  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
  });

  it("remove point to a music recommendation", async () => {
    const body = {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    const { id } = await recommendationFactory(body.name, body.youtubeLink);

    const result = await supertest(app).post(`/recommendations/${id}/downvote`);
    const status = result.status;

    expect(status).toEqual(200);
  });

  it("recommendation with -5 points", async () => {
    const body = {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    const { id } = await recommendationFactory(body.name, body.youtubeLink);

    await supertest(app).post(`/recommendations/${id}/downvote`);
    await supertest(app).post(`/recommendations/${id}/downvote`);
    await supertest(app).post(`/recommendations/${id}/downvote`);
    await supertest(app).post(`/recommendations/${id}/downvote`);
    await supertest(app).post(`/recommendations/${id}/downvote`);
    await supertest(app).post(`/recommendations/${id}/downvote`);

    const result = await supertest(app).post(`/recommendations/${id}/downvote`);

    const status = result.status;

    expect(status).toEqual(404);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
