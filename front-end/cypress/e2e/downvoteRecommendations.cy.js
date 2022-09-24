import { faker } from "@faker-js/faker";

describe("POST downvote", () => {
  beforeEach(async () => {
    await cy.request("POST", "http://localhost:5000/e2e/reset", {});
  });

  it("downvote a music video", async () => {
    const recommendation = {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    cy.visit("http://localhost:3000");

    cy.request("POST", "http://localhost:5000/recommendations", recommendation);

    cy.get("#godown").click();

    cy.get("#score").contains("-1");
  });
});
