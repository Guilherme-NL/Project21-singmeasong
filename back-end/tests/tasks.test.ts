import app from "../src/app";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { prisma } from "../src/database";
import recommendationFactory from "./factories/recommendationFactory";

describe("/recommendations POST", () => {
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

describe("/recommendations/id/upvote POST", () => {
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

describe("/recommendations/id/downvote POST", () => {
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

describe("/recommendations GET", () => {
  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
  });

  it("get all recommendations", async () => {
    const result = await supertest(app).get("/recommendations");
    const status = result.status;

    expect(status).toEqual(200);
    expect(result.body.length).toEqual(0);
  });

  it("get recommendation by id", async () => {
    const body = {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    const { id } = await recommendationFactory(body.name, body.youtubeLink);

    const result = await supertest(app).get(`/recommendations/${id}`);
    const status = result.status;

    expect(status).toEqual(200);
  });

  it("get recommendation by id, but id don't exist", async () => {
    const id = 9999999999;

    const result = await supertest(app).get(`/recommendations/${id}`);
    const status = result.status;

    expect(status).toEqual(404);
  });

  it("get recommendation random", async () => {
    const body = {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    await recommendationFactory(body.name, body.youtubeLink);

    const result = await supertest(app).get(`/recommendations/random`);
    const status = result.status;

    expect(status).toEqual(200);
  });

  it("get recommendation random, without music registered", async () => {
    const result = await supertest(app).get(`/recommendations/random`);
    const status = result.status;

    expect(status).toEqual(404);
  });

  it("get recommendation top", async () => {
    const amount = 2;
    const body1 = {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    const body2 = {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    await recommendationFactory(body1.name, body1.youtubeLink);
    await recommendationFactory(body2.name, body2.youtubeLink);

    const result = await supertest(app).get(`/recommendations/top/${amount}`);
    const status = result.status;

    expect(status).toEqual(200);
    expect(result.body.length).toEqual(amount);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
