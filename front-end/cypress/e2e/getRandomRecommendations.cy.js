import { faker } from "@faker-js/faker";

describe("GET random recommendation", () => {
  beforeEach(async () => {
    await cy.request("POST", "http://localhost:5000/e2e/reset", {});
  });

  it("GET top videos", async () => {
    const recommendation = {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    cy.visit("http://localhost:3000");

    cy.request("POST", "http://localhost:5000/recommendations", recommendation);

    cy.get("#random").click();

    cy.url().should("equal", "http://localhost:3000/random");
    cy.contains(recommendation.name).should("be.visible");
  });
});
