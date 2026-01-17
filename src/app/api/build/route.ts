import { openrouter, defaultModel } from '@/lib/ai';
import { generateText } from 'ai';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
    const { option, profile, analysis } = await req.json();

    // Generate the full page code
    const { text: code } = await generateText({
        model: openrouter(defaultModel),
        system: `You are an expert React/Next.js developer.
    Generate a complete, single-file React component for a landing page based on the provided design option.
    
    Rules:
    1. Use 'lucide-react' for icons.
    2. Use 'framer-motion' for animations.
    3. Use Tailwind CSS for styling.
    4. The component must be default exported.
    5. Do NOT use any external components other than standard HTML elements and the libraries mentioned.
    6. Ensure the code is production-ready and visually stunning.
    7. Include a hero section, features section, about section, and contact/CTA section.
    8. Use the color palette and theme specified in the option.
    `,
        prompt: `Design Option: ${JSON.stringify(option)}
    Client Profile: ${JSON.stringify(profile)}
    Competitor Strategy: ${JSON.stringify(analysis)}
    
    Generate the 'CurrentSite' component code now.`,
    });

    // Clean up the code (remove markdown code blocks if present)
    const cleanCode = code.replace(/```tsx?/g, '').replace(/```/g, '');

    // Write to file
    const filePath = path.join(process.cwd(), 'src', 'components', 'generated', 'CurrentSite.tsx');
    await fs.writeFile(filePath, cleanCode);

    return Response.json({ success: true });
}
