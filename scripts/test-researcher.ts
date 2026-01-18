import fs from 'fs';
import path from 'path';
import { researchCompetitors } from '../src/lib/agents/researcher';

// Load environment variables manually
console.log('Loading environment variables...');
const envPath = path.join(process.cwd(), '.env.local');
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^["']|["']$/g, ''); // remove quotes
            if (key && !process.env[key]) {
                process.env[key] = value;
            }
        }
    });
    console.log('Environment variables loaded.');
} catch (e) {
    console.error('Failed to load .env.local', e);
}

async function main() {
    console.log("Testing Researcher Agent...");
    try {
        const businessType = "AI-powered coffee shop";
        console.log(`Researching for: ${businessType}`);

        const result = await researchCompetitors(businessType);

        console.log("\n--- Research Complete ---");
        console.log(JSON.stringify(result, null, 2));

        if (result.competitors.length > 0 && result.marketGaps.length > 0) {
            console.log("\n✅ Test Passed: Data structure looks correct.");
        } else {
            console.error("\n❌ Test Failed: Missing data.");
        }
    } catch (error) {
        console.error("\n❌ Test Failed with error:", error);
    }
}

main();
