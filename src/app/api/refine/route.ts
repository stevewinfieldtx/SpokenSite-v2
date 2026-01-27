import { openrouter, defaultModel } from '@/lib/ai';
import { generateText } from 'ai';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
    const { transcript: providedTranscript, conversation_id } = await req.json();

    let transcript = providedTranscript;

    // If conversation_id is provided, fetch transcript from ElevenLabs
    if (!transcript && conversation_id) {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (apiKey) {
            const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${conversation_id}`, {
                headers: { 'xi-api-key': apiKey },
            });
            if (response.ok) {
                const data = await response.json();
                transcript = data.transcript.map((t: any) => `${t.role === 'agent' ? 'AI' : 'User'}: ${t.message}`).join('\n');
            }
        }
    }

    if (!transcript) {
        return new Response('Missing transcript or conversation_id', { status: 400 });
    }

    // Read current code
    const filePath = path.join(process.cwd(), 'src', 'components', 'generated', 'CurrentSite.tsx');
    let currentCode = '';
    try {
        currentCode = await fs.readFile(filePath, 'utf-8');
    } catch (error) {
        return new Response('Current site not found', { status: 404 });
    }

    // Generate modified code
    const { text: code } = await generateText({
        model: openrouter(defaultModel),
        system: `You are an expert React/Next.js developer.
    You are tasked with modifying an existing React component based on user feedback.
    
    Rules:
    1. Maintain the existing structure and style unless explicitly asked to change.
    2. Use 'lucide-react', 'framer-motion', and Tailwind CSS.
    3. The component must be default exported.
    4. Return ONLY the full, valid React component code.
    `,
        prompt: `Current Code:
    ${currentCode}
    
    User Feedback (Transcript):
    ${transcript}
    
    Apply the changes requested by the user.`,
    });

    // Clean up the code
    const cleanCode = code.replace(/```tsx?/g, '').replace(/```/g, '');

    // Write back to file
    await fs.writeFile(filePath, cleanCode);

    return Response.json({ success: true });
}
