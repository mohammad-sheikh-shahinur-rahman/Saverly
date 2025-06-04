
'use server';
/**
 * @fileOverview An AI agent that provides smart savings tips.
 *
 * - getSavingsTip - A function that provides a savings tip based on recent transactions.
 * - SavingsTipInput - The input type for the getSavingsTip function.
 * - SavingsTipResponse - The return type for the getSavingsTip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Simplified TransactionSchema for this specific flow's needs
const TransactionSchema = z.object({
  title: z.string().describe('The title or description of the transaction.'),
  type: z.enum(['income', 'expense']).describe('The type of transaction.'),
  amount: z.number().describe('The amount of the transaction.'),
  category: z.string().describe('The category of the transaction.'),
});

const SavingsTipInputSchema = z.object({
  transactions: z.array(TransactionSchema).optional().describe('A list of recent transactions for context.'),
  userName: z.string().optional().describe('The name of the user, for personalization.'),
});
export type SavingsTipInput = z.infer<typeof SavingsTipInputSchema>;

const SavingsTipResponseSchema = z.object({
  tip: z.string().describe("A concise and actionable savings tip in Bengali."),
});
export type SavingsTipResponse = z.infer<typeof SavingsTipResponseSchema>;

export async function getSavingsTip(input: SavingsTipInput): Promise<SavingsTipResponse> {
  return savingsTipFlow(input);
}

const savingsTipPrompt = ai.definePrompt({
  name: 'savingsTipPrompt',
  input: {schema: SavingsTipInputSchema},
  output: {schema: SavingsTipResponseSchema},
  prompt: `You are a helpful financial advisor for an app called Saverly.
Your goal is to provide one short, actionable savings tip in Bengali (Bangla) based on the user's recent transactions.
Focus on identifying potential areas for saving or better financial habits. Keep the tip to 1-2 sentences.
You MUST provide your response in Bengali (Bangla) language.

{{#if userName}}The user's name is {{userName}}.{{/if}}

{{#if transactions}}
Here are some recent transactions for context:
{{#each transactions}}
- {{title}} ({{type}}): ৳{{amount}} (Category: {{category}})
{{/each}}
{{else}}
No recent transactions provided. Provide a general savings tip in Bengali.
{{/if}}

Savings Tip (in Bengali):
`,
});

const savingsTipFlow = ai.defineFlow(
  {
    name: 'savingsTipFlow',
    inputSchema: SavingsTipInputSchema,
    outputSchema: SavingsTipResponseSchema,
  },
  async (input) => {
    const {output} = await savingsTipPrompt(input);
    if (!output) {
      throw new Error('AI থেকে টিপ পেতে ব্যর্থ হয়েছে।');
    }
    return output;
  }
);
