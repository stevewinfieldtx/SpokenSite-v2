import { createOpenAI } from '@ai-sdk/openai';

export const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// OpenRouter uses the OpenAI SDK format but with a different base URL
export const openrouter = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
});

export const defaultModel = process.env.OPENROUTER_MODEL_ID || 'anthropic/claude-3.5-sonnet';

export const GPT4o = 'gpt-4o';
export const GPT35 = 'gpt-3.5-turbo';
