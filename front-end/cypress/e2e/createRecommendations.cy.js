import { faker } from "@faker-js/faker";

describe("empty spec", () => {
  beforeEach(async () => {
    await cy.request("POST", "http://localhost:5000/e2e/reset", {});
  });

  it("add a new music recommendation", () => {
    const recommendation = {
      name: faker.music.songName(),
      url: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };
    cy.visit("http://localhost:3000");
    cy.get("#name").type(recommendation.name);
    cy.get("#url").type(recommendation.url);

    cy.intercept("POST", "/recommendations").as("postRecommendations");

    cy.get("#createRecommendation").click();

    cy.wait("@postRecommendations");

    cy.contains(recommendation.name).should("be.visible");
  });
});
