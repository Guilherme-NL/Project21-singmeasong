import { faker } from "@faker-js/faker";

describe("POST upvote", () => {
  beforeEach(async () => {
    await cy.request("POST", "http://localhost:5000/e2e/reset", {});
  });

  it("upvote a music video", async () => {
    const recommendation = {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    cy.visit("http://localhost:3000");

    cy.request("POST", "http://localhost:5000/recommendations", recommendation);

    cy.get("#goup").click();

    cy.get("#score").contains("1");
  });
});
