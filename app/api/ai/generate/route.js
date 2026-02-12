import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
    try {
        const { type, resumeText: rawResumeText, jdText, applicationId, resumeId } = await req.json();
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

        let resumeText = rawResumeText;

        // Fetch resume if needed
        if (!resumeText || resumeText === "REPLACE_WITH_ACTUAL_RESUME_TEXT" || resumeText === "FETCH_FROM_DB" || resumeText === "FETCH_IN_PANEL") {
            if (!userId) {
                return NextResponse.json({ error: "Please upload a resume first or log in." }, { status: 400 });
            }

            const resumeSource = resumeId
                ? await prisma.resume.findFirst({ where: { id: resumeId, userId } })
                : await prisma.resume.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } });

            if (!resumeSource) {
                return NextResponse.json({ error: "No resume found. Please upload one first." }, { status: 400 });
            }
            resumeText = resumeSource.extractedText;
        }

        // 1. Guest Check & Rate Limiting
        if (!userId) {
            const usage = await prisma.guestUsage.findUnique({
                where: { ipAddress: ip }
            });

            if (usage && usage.requestCount >= 3) {
                return NextResponse.json(
                    { error: "Free limit reached. Please register to continue." },
                    { status: 403 }
                );
            }

            // Increment guest usage
            await prisma.guestUsage.upsert({
                where: { ipAddress: ip },
                update: { requestCount: { increment: 1 } },
                create: { ipAddress: ip, requestCount: 1 }
            });
        }

        // 2. Define System Prompt based on type
        let systemPrompt = "";
        if (type === 'COVER_LETTER') {
            systemPrompt = "You are an expert career coach. Write a professional, concise cover letter based on the candidate's resume and the job description. The cover letter should be tailored to the specific role and company mentioned in the JD. Tone: Confident, professional, and humble. Structure it properly with placeholders for date and contact info if not provided.";
        } else if (type === 'LINKEDIN_MESSAGE') {
            systemPrompt = "Write a short (under 300 characters) LinkedIn connection request message to a hiring manager or recruiter. It should be professional, warm, and mention why you're interested in the role based on the JD.";
        } else if (type === 'COLD_EMAIL') {
            systemPrompt = "Write a compelling cold email to a hiring manager. It should have a strong subject line, be brief, and highlight why your background (from the resume) makes you a great fit for the role (from the JD).";
        }

        // 3. Generate content stream
        const result = await streamText({
            model: openai('gpt-4o'),
            system: systemPrompt,
            prompt: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jdText}`,
            onFinish: async (event) => {
                // Log Usage
                try {
                    await prisma.aIRequestLog.create({
                        data: {
                            userId: userId || null,
                            provider: "openai",
                            feature: `generate_${type.toLowerCase()}`,
                            tokensUsed: event.usage.totalTokens,
                        }
                    });

                    // If applicationId is provided, save the result to the DB
                    if (applicationId) {
                        await prisma.generatedContent.create({
                            data: {
                                applicationId,
                                type,
                                content: event.text,
                            }
                        });
                    }
                } catch (e) {
                    console.error("Failed to log finish event:", e);
                }
            }
        });

        return result.toTextStreamResponse();

    } catch (error) {
        console.error("AI Generation Failed:", error);
        return NextResponse.json(
            { error: "Failed to generate content" },
            { status: 500 }
        )
    }
}
