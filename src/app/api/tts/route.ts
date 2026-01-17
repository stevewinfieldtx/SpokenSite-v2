import { textToSpeech } from '@/lib/voice';

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return new Response('Missing text', { status: 400 });
        }

        const audioBuffer = await textToSpeech(text);

        return new Response(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
            },
        });
    } catch (error) {
        console.error('TTS Error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
