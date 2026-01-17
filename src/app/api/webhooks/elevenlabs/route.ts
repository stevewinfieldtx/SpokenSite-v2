import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Simple file-based store for transcripts (in a real app, use a DB)
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const TRANSCRIPTS_FILE = path.join(DATA_DIR, 'transcripts.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize transcripts file if not exists
if (!fs.existsSync(TRANSCRIPTS_FILE)) {
    fs.writeFileSync(TRANSCRIPTS_FILE, JSON.stringify({}));
}

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        console.log('Received webhook payload:', JSON.stringify(payload, null, 2));

        // Validate payload type
        if (payload.type !== 'post_call_transcription') {
            return NextResponse.json({ message: 'Ignored event type' }, { status: 200 });
        }

        const { conversation_id, transcript } = payload.data;

        if (!conversation_id || !transcript) {
            return NextResponse.json({ message: 'Invalid payload data' }, { status: 400 });
        }

        // Format transcript into a readable string
        const formattedTranscript = transcript.map((turn: any) => {
            return `${turn.role === 'agent' ? 'AI' : 'User'}: ${turn.message}`;
        }).join('\n');

        // Save to store
        const store = JSON.parse(fs.readFileSync(TRANSCRIPTS_FILE, 'utf-8'));
        store[conversation_id] = {
            transcript: formattedTranscript,
            timestamp: new Date().toISOString(),
            raw: payload.data
        };
        fs.writeFileSync(TRANSCRIPTS_FILE, JSON.stringify(store, null, 2));

        return NextResponse.json({ message: 'Transcript received and stored' }, { status: 200 });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    // Endpoint to poll for transcript status
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversation_id');

    if (!conversationId) {
        return NextResponse.json({ message: 'Missing conversation_id' }, { status: 400 });
    }

    try {
        if (!fs.existsSync(TRANSCRIPTS_FILE)) {
            return NextResponse.json({ status: 'pending' });
        }

        const store = JSON.parse(fs.readFileSync(TRANSCRIPTS_FILE, 'utf-8'));
        const data = store[conversationId];

        if (data) {
            return NextResponse.json({ status: 'completed', transcript: data.transcript });
        } else {
            return NextResponse.json({ status: 'pending' });
        }
    } catch (error) {
        return NextResponse.json({ status: 'error', message: String(error) }, { status: 500 });
    }
}
