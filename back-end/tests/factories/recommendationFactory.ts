import { prisma } from "../../src/database";

export default async function recommendationFactory(
  name: string,
  youtubeLink: string
) {
  return prisma.recommendation.create({
    data: {
      name,
      youtubeLink,
    },
  });
}
