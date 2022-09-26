import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";

import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";

describe("Unit test", () => {
  it("insert recommendations", async () => {
    const recommendationData = {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {});

    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce((): any => {});

    await recommendationService.insert(recommendationData);

    expect(recommendationRepository.findByName).toBeCalled();
    expect(recommendationRepository.create).toBeCalled();
  });

  it("insert recommendation that already exists", async () => {
    const recommendationData = {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {
        return {
          name: recommendationData.name,
          youtubeLink: recommendationData.youtubeLink,
        };
      });

    await expect(
      recommendationService.insert(recommendationData)
    ).rejects.toEqual({
      message: "Recommendations names must be unique",
      type: "conflict",
    });
  });

  it("upvote recommendations", async () => {
    const id = 1;
    const recommendationData = {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          name: recommendationData.name,
          youtubeLink: recommendationData.youtubeLink,
          score: 1,
        };
      });

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    await recommendationService.upvote(id);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("downvote recommendations, score > -5", async () => {
    const id = 1;
    const score = 1;
    const recommendationData = {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          name: recommendationData.name,
          youtubeLink: recommendationData.youtubeLink,
          score,
        };
      });

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          name: recommendationData.name,
          youtubeLink: recommendationData.youtubeLink,
          score,
        };
      });

    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    await recommendationService.downvote(id);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).not.toBeCalled();
  });

  it("downvote recommendations, score < -5", async () => {
    const id = 1;
    const score = -6;
    const recommendationData = {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          name: recommendationData.name,
          youtubeLink: recommendationData.youtubeLink,
          score,
        };
      });

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          name: recommendationData.name,
          youtubeLink: recommendationData.youtubeLink,
          score,
        };
      });

    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    await recommendationService.downvote(id);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).toBeCalled();
  });

  it("get recommendations by Id", async () => {
    const id = 1;
    const score = 1;
    const recommendationData = {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          name: recommendationData.name,
          youtubeLink: recommendationData.youtubeLink,
          score,
        };
      });

    const recommendations = await recommendationService.getById(id);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendations).toEqual({
      id: 1,
      name: recommendationData.name,
      youtubeLink: recommendationData.youtubeLink,
      score,
    });
  });

  it("get recommendations by Id, wrong Id", async () => {
    const id = 1;

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {});

    await expect(recommendationService.getById(id)).rejects.toEqual({
      message: "",
      type: "not_found",
    });
    expect(recommendationRepository.find).toBeCalled();
  });

  it("get all recommendations", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {});

    await recommendationService.get();

    expect(recommendationRepository.findAll).toBeCalled();
  });

  it("get top recommendations", async () => {
    const amount = 1;

    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockImplementationOnce((): any => {});

    await recommendationService.getTop(amount);

    expect(recommendationRepository.getAmountByScore).toBeCalled();
  });

  it("get random recommendations", async () => {
    const score = 1;
    const recommendationData = {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return [
          {
            id: 1,
            name: recommendationData.name,
            youtubeLink: recommendationData.youtubeLink,
            score,
          },
        ];
      });

    const recommendations = await recommendationService.getRandom();

    expect(recommendations).toEqual({
      id: 1,
      name: recommendationData.name,
      youtubeLink: recommendationData.youtubeLink,
      score,
    });
  });

  it("get random recommendations, length === 0", async () => {
    const arr = [];
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementation((): any => {
        return arr;
      });

    await expect(recommendationService.getRandom()).rejects.toEqual({
      message: "",
      type: "not_found",
    });
    expect(recommendationRepository.findAll).toBeCalled();
  });

  it("get score < 0.7", async () => {
    const random = 0.5;

    expect(recommendationService.getScoreFilter(random)).toEqual("gt");
  });

  it("get score > 0.7", async () => {
    const random = 0.9;

    expect(recommendationService.getScoreFilter(random)).toEqual("lte");
  });
});
