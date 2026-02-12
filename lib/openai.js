import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
    // We don't throw here to allow the app to boot if only Gemini is used
    console.warn("Missing OPENAI_API_KEY environment variable. OpenAI features will be disabled.");
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
