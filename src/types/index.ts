export type Role = 'user' | 'assistant';

export interface Message {
    id: string;
    role: Role;
    content: string;
    timestamp: number;
}

export interface InterviewState {
    id: string;
    messages: Message[];
    status: 'in-progress' | 'completed';
    transcript: string;
}

export interface ClientProfile {
    businessName: string;
    industry: string;
    description: string;
    uniqueSellingPoints: string[];
    foundingStory: string;
    goals: string[];
    targetAudience: string;
    tone: string[]; // e.g., "professional", "friendly"
    emotions: string[]; // e.g., "trust", "excitement"
}

export type Role = 'user' | 'assistant';

export interface Message {
    id: string;
    role: Role;
    content: string;
    timestamp: number;
}

export interface InterviewState {
    id: string;
    messages: Message[];
    status: 'in-progress' | 'completed';
    transcript: string;
}

export interface ClientProfile {
    businessName: string;
    industry: string;
    description: string;
    uniqueSellingPoints: string[];
    foundingStory: string;
    goals: string[];
    targetAudience: string;
    tone: string[]; // e.g., "professional", "friendly"
    emotions: string[]; // e.g., "trust", "excitement"
}

competitors: {
    name: string;
    url: string;
    strengths: string[];
    weaknesses: string[];
    gaps: string[];
} [];
marketGaps: string[];
recommendedStrategy: string;
}

export interface SiteOption {
    id: string;
    name: string;
    description: string;
    theme: string;
    layout: string;
    features: string[];
    colorPalette: string[];
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { 'agent-id': string }, HTMLElement>;
        }
    }
}
