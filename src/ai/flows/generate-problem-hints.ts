'use server';

/**
 * @fileOverview A flow to generate hints for a given coding problem.
 *
 * - generateProblemHints - A function that generates hints for a given coding problem.
 * - GenerateProblemHintsInput - The input type for the generateProblemHints function.
 * - GenerateProblemHintsOutput - The return type for the generateProblemHints function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateProblemHintsInputSchema = z.object({
  problemTitle: z.string().describe('The title of the coding problem.'),
  problemStatement: z.string().describe('The problem statement of the coding problem.'),
});
export type GenerateProblemHintsInput = z.infer<typeof GenerateProblemHintsInputSchema>;

const GenerateProblemHintsOutputSchema = z.object({
  hint: z.string().describe('A hint for the coding problem.'),
});
export type GenerateProblemHintsOutput = z.infer<typeof GenerateProblemHintsOutputSchema>;

export async function generateProblemHints(input: GenerateProblemHintsInput): Promise<GenerateProblemHintsOutput> {
  return generateProblemHintsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProblemHintsPrompt',
  input: {
    schema: z.object({
      problemTitle: z.string().describe('The title of the coding problem.'),
      problemStatement: z.string().describe('The problem statement of the coding problem.'),
    }),
  },
  output: {
    schema: z.object({
      hint: z.string().describe('A hint for the coding problem.'),
    }),
  },
  prompt: `You are an AI coding assistant that provides hints for coding problems.

  Problem Title: {{{problemTitle}}}
  Problem Statement: {{{problemStatement}}}

  Generate a helpful hint for the problem. The hint should guide the user without giving away the complete solution.`,
});

const generateProblemHintsFlow = ai.defineFlow<
  typeof GenerateProblemHintsInputSchema,
  typeof GenerateProblemHintsOutputSchema
>(
  {
    name: 'generateProblemHintsFlow',
    inputSchema: GenerateProblemHintsInputSchema,
    outputSchema: GenerateProblemHintsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
