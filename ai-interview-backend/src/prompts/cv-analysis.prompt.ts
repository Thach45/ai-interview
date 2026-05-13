export const CV_ANALYSIS_SYSTEM_PROMPT = `
You are an expert HR Specialist and Career Coach with 20+ years of experience in technical recruitment and ATS (Applicant Tracking System) optimization.
Your task is to analyze a candidate's CV against a specific Job Description (JD). Provide a highly professional, objective, and actionable analysis.

CRITICAL REQUIREMENT: Return ONLY a valid JSON object matching the following structure. 
DO NOT include markdown formatting like \`\`\`json. Return the raw JSON string.

ENUM VALUES TO USE:
- AnalysisPriority: "HIGH", "MEDIUM", "LOW"
- ScoreCategory: "TECHNICAL_SKILLS", "EXPERIENCE", "SOFT_SKILLS", "EDUCATION", "PROJECT_RELEVANCE"

JSON STRUCTURE:
{
  "matchScore": number,
  "summary": "string",
  "scoringDetails": [{ "category": "TECHNICAL_SKILLS" | "EXPERIENCE" | "SOFT_SKILLS" | "EDUCATION" | "PROJECT_RELEVANCE", "score": number, "reason": "string" }],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "skillsAnalysis": [{ "skill": "string", "user": number, "required": number }],
  "foundKeywords": ["string"],
  "missingKeywords": ["string"],
  "improvementSuggestions": [{ "title": "string", "desc": "string", "solution": "string", "priority": "HIGH" | "MEDIUM" | "LOW" }]
}
`;

export const getCVAnalysisUserPrompt = (cvContent: string, jdContent: string) => `
Please analyze the following data:

[JOB DESCRIPTION]
${jdContent}

[CANDIDATE CV]
${cvContent}

Instructions:
1. Identify 5-7 key skills from the JD for 'skillsAnalysis'.
2. Provide specific 'solution' for each improvement suggestion.
3. Ensure all numbers are 0-100.
4. Output must be in Vietnamese for 'summary', 'reason', 'strengths', 'weaknesses', 'title', 'desc', and 'solution'.
`;

export const CV_ANALYSIS_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    matchScore: { type: 'number' },
    summary: { type: 'string' },
    scoringDetails: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: [
              'TECHNICAL_SKILLS',
              'EXPERIENCE',
              'SOFT_SKILLS',
              'EDUCATION',
              'PROJECT_RELEVANCE',
            ],
          },
          score: { type: 'number' },
          reason: { type: 'string' },
        },
        required: ['category', 'score', 'reason'],
      },
    },
    strengths: { type: 'array', items: { type: 'string' } },
    weaknesses: { type: 'array', items: { type: 'string' } },
    skillsAnalysis: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          skill: { type: 'string' },
          user: { type: 'number' },
          required: { type: 'number' },
        },
        required: ['skill', 'user', 'required'],
      },
    },
    foundKeywords: { type: 'array', items: { type: 'string' } },
    missingKeywords: { type: 'array', items: { type: 'string' } },
    improvementSuggestions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          desc: { type: 'string' },
          solution: { type: 'string' },
          priority: { type: 'string', enum: ['HIGH', 'MEDIUM', 'LOW'] },
        },
        required: ['title', 'desc', 'solution', 'priority'],
      },
    },
  },
  required: [
    'matchScore',
    'summary',
    'scoringDetails',
    'strengths',
    'weaknesses',
    'skillsAnalysis',
    'foundKeywords',
    'missingKeywords',
    'improvementSuggestions',
  ],
};
