import { GoogleGenAI } from "@google/genai";

// The API key is provided via vite.config.ts and is accessible as process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generates a title summary for a property using the Gemini API.
 */
export const generateTitleSummary = async (): Promise<string> => {
    try {
        const prompt = `
            Generate a concise title summary for a property. The response should be a single paragraph of text.
            Key details:
            - Property Owner: COLUMBUS STATE COMMUNITY COLLEGE
            - APN: 010-014105
            - Status: No active liens or judgments found.
            - History: The last sale was for a very high amount, indicating a significant transaction.
            
            Based on this, write a professional summary.
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text;

    } catch (error) {
        console.error("Error generating title summary:", error);
        return "<p><strong>Error:</strong> Could not generate the AI summary at this time. Please try again later.</p>";
    }
};

/**
 * Generates a standard ALTA Title Commitment document in HTML format.
 */
export const generateTitleCommitment = async (): Promise<string> => {
    try {
        const prompt = `
            Generate a standard ALTA Title Commitment document in simple HTML format.
            The response MUST be only the HTML code, starting with <h1> and with no other text or markdown.
            
            Use the following details:
            - Property Owner: COLUMBUS STATE COMMUNITY COLLEGE
            - Property Address: 250 Cleveland Ave, Columbus, OH 43215
            
            Structure the HTML with:
            - A main <h1> for "Title Commitment".
            - <h2> sections for "Schedule A", "Schedule B-I - Requirements", and "Schedule B-II - Exceptions".
            - Use <p> and <ul>/<li> tags for content within each section.
            - Populate Schedule A with the owner and address.
            - Add placeholder text for the requirements and exceptions sections. For example, for exceptions, list common items like "Rights of parties in possession" and "Standard utility easements".
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;

    } catch (error) {
        console.error("Error generating title commitment:", error);
        return "<h2>Error Generating Title Commitment</h2><p>Could not generate the title commitment due to an API error. Please try again later.</p>";
    }
};
