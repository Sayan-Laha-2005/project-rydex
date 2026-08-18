import connectDb from "@/lib/db";
import ChatMessage from "@/models/chatMessage.model";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


const geminiUrl = process.env.GEMINI_API_URL!

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const { lastMessage, role } = await req.json()

        const prompt = `
You are an AI reply suggestion system for a vehicle booking chat app.
Generate short,amart,human-like quick reply suggestions based on :
-ROLE (DRIVER or USER)
-RECENT_MESSAGE

Rules:
- Return exactly 3 suggestions
- keep replies short (3-12 words)
- Match the conversation context and tone
- Driver replies should sound professional and helpful
- User replies should sound natural and realistic
- Avoid repetition
- Return ONLY valid JSON

Output format:
{
  "suggestions": [
    "Reply 1",
    "Reply 2",
    "Reply 3"
  ]
}

Input:
ROLE: ${role}
RECENT_MESSAGE: "${lastMessage}"
`;

        const response = await axios.post(
            geminiUrl,
            {
                model: "gemini-3.7-flash",
                input: prompt,
            },
            {
                headers: {
                    "x-goog-api-key": process.env.GEMINI_API_KEY!,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(
            "GEMINI RESPONSE:",
            JSON.stringify(response.data, null, 2)
        );


        const modelOutput = response.data.steps.find(
            (step: any) => step.type === "model_output"
        );

        const text = modelOutput?.content?.[0]?.text;

        if (!text) {
            throw new Error("No AI response received");
        }

        const suggestions = JSON.parse(text);

        return NextResponse.json({
            message: "Success",
            response: suggestions,
        });

    } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
        return NextResponse.json(
            { message: "AI request limit reached. Please try again later." },
            { status: 429 }
        )
    }

    return NextResponse.json(
        { message: `get ai suggestion messages error ${error}` },
        { status: 500 }
    )
}
}