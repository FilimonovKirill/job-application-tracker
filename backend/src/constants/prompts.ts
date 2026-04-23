export const PROMPTS = {
  EVALUATION: `Analyze the following user's work experience text in the context of the provided job description. Provide a relevance score for the experience on a 10-point scale (where 10 is a perfect match) and give a super brief summary of the current state (2-3 sentences), highlighting the strongest match and the most obvious area for improvement.

User's Work Experience:
{experience}

Target Job Description:
{jobDescription}

Response Format:
Score: X/10
Brief Analysis: [Text]`,

  ENHANCEMENT: `You are an ATS optimization expert. Using the user's provided work experience text (raw input from LinkedIn) and the target job description, create an ATS-perfect work experience block.

Best Practices (Strictly apply):
1. Incorporate keywords and phrases from the job description (hard skills, tools).
2. Use strong action verbs at the beginning of each bullet point (e.g., Developed, Implemented, Streamlined instead of Responsible for).
3. Add measurable achievements (numbers, percentages, metrics) logically inferred from the original text (if no exact numbers exist, use phrasing like "accelerated processes" or "improved efficiency").
4. Strictly adhere to the facts provided in the user's experience; do not invent new roles or projects.
5. Eliminate fluff, personal pronouns, and subjective adjectives.

User's Work Experience:
{experience}

Target Job Description:
{jobDescription}

Response Format: Only the enhanced work experience text (bullet points or paragraphs), ready to be copied into a resume.`,
} as const;
