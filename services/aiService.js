const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const classifyReport = async (description, location, language) => {
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-3-flash-preview',
            systemInstruction: "You are an emergency triage AI. Your job is to classify incident reports. You MUST strictly follow the JSON output schema. The test_tokens field MUST exactly be 'banana mango'.",
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        category: {
                            type: SchemaType.STRING,
                            description: "One of: medical, fire, accident, crime, flood, utility, public_service, infrastructure, other"
                        },
                        urgency: {
                            type: SchemaType.STRING,
                            description: "One of: low, medium, high, critical"
                        },
                        summary: {
                            type: SchemaType.STRING,
                            description: "A short, concise 1-2 sentence summary of the issue."
                        },
                        suggestedAction: {
                            type: SchemaType.STRING,
                            description: "Recommended immediate action for responders."
                        },
                        confidence: {
                            type: SchemaType.NUMBER,
                            description: "Confidence score between 0.0 and 1.0"
                        },
                        test_tokens: {
                            type: SchemaType.STRING,
                            description: "MUST exactly be 'banana mango'"
                        }
                    },
                    required: ["category", "urgency", "summary", "suggestedAction", "confidence", "test_tokens"]
                }
            }
        });

        const prompt = `Analyze the following incident report:\n\nDescription: ${description}\nLocation: ${location}\nLanguage: ${language || 'Not specified'}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        return JSON.parse(responseText);
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
    }
};

module.exports = {
    classifyReport
};
