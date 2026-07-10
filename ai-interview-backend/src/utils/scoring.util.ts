export function calculateFinalInterviewResult(
  parsed: any,
  coreQuestions: Array<{ title: string; reason: string; criteria?: any[] }>,
) {
  let totalDomainScore = 0;
  let totalPossibleDomainScore = 0;

  const evaluatedQuestions = parsed.questionEvaluations.map((qEval: any) => {
    const coreQ =
      coreQuestions[qEval.questionIndex - 1] ||
      coreQuestions.find((cq) => cq.title === qEval.questionTitle);
    let qScore = 0;
    let qPossibleScore = 0;

    if (coreQ && coreQ.criteria) {
      for (const crit of coreQ.criteria) {
        const points = crit.points || 0;
        qPossibleScore += points;

        const match = qEval.criteriaMatches?.find((m: any) => m.criterionId === crit.id);
        if (match) {
          qScore += points * match.partialCredit;
        }
      }
    }

    totalDomainScore += qScore;
    totalPossibleDomainScore += qPossibleScore;

    return {
      ...qEval,
      score: qPossibleScore > 0 ? (qScore / qPossibleScore) * 100 : 0,
    };
  });

  const avgDomain =
    totalPossibleDomainScore > 0 ? (totalDomainScore / totalPossibleDomainScore) * 100 : 0;

  const ss = parsed.softSkillsEvaluation;
  const avgOverall =
    avgDomain * 0.5 +
    ss.problemSolving.score * 0.2 +
    ss.clarity.score * 0.1 +
    ss.confidence.score * 0.1 +
    ss.relevance.score * 0.1;

  return {
    generalEvaluation: {
      overall: {
        score: Math.round(avgOverall),
        reason: 'Tổng hợp dựa trên trọng số kiến thức và kỹ năng mềm.',
      },
      domain: {
        score: Math.round(avgDomain),
        reason: 'Tính toán tự động dựa trên mức độ đạt tiêu chí chuyên môn (Rubric).',
      },
      problemSolving: ss.problemSolving,
      clarity: ss.clarity,
      confidence: ss.confidence,
      relevance: ss.relevance,
    },
    recommendation: parsed.recommendation,
    summary: parsed.summary,
    strengths: parsed.strengths,
    weaknesses: parsed.weaknesses,
    learningPath: parsed.learningPath,
    questionEvaluations: evaluatedQuestions,
  };
}
