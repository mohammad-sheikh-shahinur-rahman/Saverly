
'use server';
/**
 * @fileOverview A financial advisor AI agent that can chat with the user.
 *
 * - getFinancialAdvice - A function that provides financial advice based on user queries and context.
 * - ChatInput - The input type for the getFinancialAdvice function.
 * - ChatResponse - The return type for the getFinancialAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TransactionSchema = z.object({
  title: z.string().describe('The title or description of the transaction.'),
  type: z.enum(['income', 'expense']).describe('The type of transaction.'),
  amount: z.number().describe('The amount of the transaction.'),
  category: z.string().describe('The category of the transaction.'),
});

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']).describe('The role of the message sender (user or AI model).'),
  content: z.string().describe('The content of the message.'),
});

const ChatInputSchema = z.object({
  userQuery: z.string().describe("The user's current question or message to the financial advisor."),
  transactions: z.array(TransactionSchema).optional().describe('A list of recent transactions for context.'),
  userName: z.string().optional().describe('The name of the user, for personalization.'),
  chatHistory: z.array(ChatMessageSchema).optional().describe('The history of the conversation.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatResponseSchema = z.object({
  response: z.string().describe("The AI's response in Bengali."),
});
export type ChatResponse = z.infer<typeof ChatResponseSchema>;

export async function getFinancialChatResponse(input: ChatInput): Promise<ChatResponse> {
  return financialAdvisorChatFlow(input);
}

const financialAdvisorChatPrompt = ai.definePrompt({
  name: 'financialAdvisorChatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatResponseSchema},
  prompt: `You are a friendly and helpful AI Financial Advisor for an app called Saverly.
Your goal is to provide concise and actionable financial advice in Bengali (Bangla) based on the user's queries.
You MUST provide all your responses in Bengali (Bangla) language.
{{#if userName}}The user's name is {{userName}}. Address them accordingly.{{/if}}

{{#if transactions}}
Here are some recent transactions for context, use them if relevant to the query:
{{#each transactions}}
- {{title}} ({{type}}): ৳{{amount}} (Category: {{category}})
{{/each}}
{{/if}}

Conversation History (if any):
{{#if chatHistory}}
{{#each chatHistory}}
{{this.role}}: {{this.content}}
{{/each}}
{{else}}
No previous conversation history. This is the start of the conversation.
{{/if}}

Current User Query:
user: {{{userQuery}}}
AI (Respond in Bengali):
`,
});

const financialAdvisorChatFlow = ai.defineFlow(
  {
    name: 'financialAdvisorChatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatResponseSchema,
  },
  async (input) => {
    const {output} = await financialAdvisorChatPrompt(input);
    if (!output) {
      throw new Error('AI থেকে উত্তর পেতে ব্যর্থ হয়েছে।');
    }
    return output;
  }
);
