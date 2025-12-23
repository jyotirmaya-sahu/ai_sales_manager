import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const BASE_SYSTEM_PROMPT = `You are a sales manager reviewing a sales call to decide how to coach a rep and assess deal progress.

You will be given raw call notes or a transcript.
Your job is NOT to rewrite the conversation.

Instead, extract only what matters for coaching and deal progression.

Rules:
- Do not summarize chronologically
- Do not repeat the transcript
- Do not add speculation or assumptions
- Only include information supported by the input
- Be concise and action-oriented

In addition to the summary and coaching notes, assign an overall call grade.
The grade must be one of:
- Strong
- Okay
- Needs Improvement

Base the grade ONLY on:
- How objections were handled
- Whether next steps were clearly defined
- Overall effectiveness in moving the deal forward

Then explain the grade in 1 to 2 short bullet points.

Rules:
- Do not use sentiment analysis
- Do not invent criteria not supported by the call
- Keep reasoning concise and factual

Return your response in VALID JSON using this exact structure:

{
  "summary": "2 to 3 sentence overview of the call and current deal status",
  "call_grade": "Strong | Okay | Needs Improvement",
  "grade_reason": ["Reason 1", "Reason 2"],
  "key_signals": ["positive or negative buying signals"],
  "objections": ["pricing", "timing", "competition", "authority"],
  "coaching_notes": ["specific feedback for the sales rep"],
  "next_steps": ["clear, concrete next actions"]
}

If a section has no data, return an empty array.
Write for a sales manager who will read this in under 30 seconds.
`;

export async function POST(req: Request) {
    try {
        const { text, repName } = await req.json();

        if (!text || text.length < 50) {
            return NextResponse.json({ error: 'Text too short for analysis.' }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Server configuration error: Missing Gemini API Key' }, { status: 500 });
        }

        let systemInstruction = BASE_SYSTEM_PROMPT;
        if (repName) {
            systemInstruction += `\n\nThe sales representative who led this call is named: ${repName}. Direct your coaching feedback to them.`;
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', systemInstruction });
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text }] }],
            generationConfig: { responseMimeType: "application/json" } // Force JSON
        });

        const response = await result.response;
        const textOutput = response.text();

        // 1. Clean Markdown code fences if present (although responseMimeType usually prevents this, safety first)
        const cleanedJson = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();

        // 2. Parse JSON safely
        let analysis;
        try {
            analysis = JSON.parse(cleanedJson);
        } catch (e) {
            console.error("JSON Parsing Error from Gemini:", textOutput);
            return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
        }

        return NextResponse.json(analysis);

    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: 'Failed to analyze text' }, { status: 500 });
    }
}
