import { generateText } from 'ai';
import { openai, GPT4o } from '@/lib/ai';
import { InterviewState, Message } from '@/types';

export async function generateNextQuestion(history: Message[]) {
    // TODO: Implement logic to analyze history and generate the next question
    return "What is the primary goal of your website?";
}
