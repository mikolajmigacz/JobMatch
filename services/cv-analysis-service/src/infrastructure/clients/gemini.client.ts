import { GoogleGenerativeAI } from '@google/generative-ai';
import { EnvConfig } from '@config/env.config';
import { CVAnalysis, CVAnalysisSchema } from '@shared/schemas';

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor(config: EnvConfig) {
    this.genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async analyzeCV(cvText: string): Promise<CVAnalysis> {
    const prompt = this.buildPrompt(cvText);
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const parsedResponse = this.parseResponse(text);
        const validated = CVAnalysisSchema.parse(parsedResponse);
        return validated;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        if (this.isRateLimitError(error)) {
          const delay = this.retryDelay * Math.pow(2, attempt);
          await this.sleep(delay);
          continue;
        }

        if (attempt === this.maxRetries - 1) {
          break;
        }

        await this.sleep(this.retryDelay);
      }
    }

    throw new Error(
      `Failed to analyze CV after ${this.maxRetries} attempts: ${lastError?.message}`
    );
  }

  private buildPrompt(cvText: string): string {
    return `Analyze the following CV and provide a structured JSON response.

CV Content:
${cvText}

Provide your analysis in the following JSON format:
{
  "overallScore": <number 0-100>,
  "skills": [
    {
      "name": "<skill name>",
      "level": "<beginner|intermediate|advanced|expert>",
      "yearsOfExperience": <number>
    }
  ],
  "experience": [
    {
      "company": "<company name>",
      "position": "<job title>",
      "duration": "<time period>",
      "description": "<brief description>"
    }
  ],
  "education": [
    {
      "institution": "<school name>",
      "degree": "<degree type>",
      "field": "<field of study>",
      "year": "<graduation year>"
    }
  ],
  "summary": "<brief overall summary>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"]
}

Criteria for overallScore (0-100):
- Skills relevance and depth: 30 points
- Experience quality and duration: 30 points
- Education background: 20 points
- Career progression: 10 points
- Communication and presentation: 10 points

Provide ONLY the JSON object, no additional text.`;
  }

  private parseResponse(text: string): any {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    try {
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      throw new Error(
        `Failed to parse JSON response: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private isRateLimitError(error: any): boolean {
    const message = error?.message?.toLowerCase() || '';
    return message.includes('rate limit') || message.includes('quota') || message.includes('429');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
