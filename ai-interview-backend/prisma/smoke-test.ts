import { randomUUID } from 'node:crypto';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = `postgres-smoke-${randomUUID()}@example.invalid`;

  try {
    const user = await prisma.user.create({
      data: {
        email,
        fullName: 'PostgreSQL Smoke Test',
        emailVerifiedAt: new Date(),
      },
    });

    const expectedCvData = {
      fullName: 'PostgreSQL Smoke Test',
      jobTitle: 'Backend Engineer',
      contact: { email },
      experiences: [
        {
          company: 'Arion',
          role: 'Engineer',
          period: '2026',
          details: ['Verified JSONB round-trip'],
        },
      ],
      projects: [],
      hardSkills: ['PostgreSQL', 'Prisma'],
      computerSkills: [],
      languages: [],
      education: [],
      certifications: [],
      activities: [],
      references: [],
    } satisfies Prisma.InputJsonObject;

    const cv = await prisma.userCv.create({
      data: {
        userId: user.id,
        title: 'PostgreSQL JSONB smoke test',
        sourceType: 'BUILDER',
        cvData: expectedCvData,
      },
    });

    const persistedCv = await prisma.userCv.findUniqueOrThrow({
      where: { id: cv.id },
    });

    const persistedData = persistedCv.cvData as Prisma.JsonObject;
    if (persistedData.fullName !== expectedCvData.fullName) {
      throw new Error('JSONB payload did not round-trip correctly');
    }

    const analysis = await prisma.cvAnalysis.create({
      data: {
        userId: user.id,
        cvId: cv.id,
        matchScore: 80,
        scoringDetails: [],
        strengths: [],
        weaknesses: [],
        skillsAnalysis: [],
        foundKeywords: [],
        missingKeywords: [],
        improvementSuggestions: [],
      },
    });

    const optimizedCv = await prisma.userCv.create({
      data: {
        userId: user.id,
        title: 'Optimized PostgreSQL smoke test',
        sourceType: 'BUILDER',
        cvAnalysisId: analysis.id,
        cvData: expectedCvData,
      },
    });

    await prisma.cvAnalysis.delete({ where: { id: analysis.id } });

    const detachedOptimizedCv = await prisma.userCv.findUniqueOrThrow({
      where: { id: optimizedCv.id },
    });
    if (detachedOptimizedCv.cvAnalysisId !== null) {
      throw new Error('ON DELETE SET NULL did not detach the optimized CV');
    }

    await prisma.user.delete({ where: { id: user.id } });

    const remainingCvs = await prisma.userCv.count({
      where: { id: cv.id },
    });
    if (remainingCvs !== 0) {
      throw new Error('PostgreSQL cascade delete did not remove the test CV');
    }

    console.log('PostgreSQL/Prisma JSONB smoke test passed');
  } finally {
    await prisma.user.deleteMany({ where: { email } });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
