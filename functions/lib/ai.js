"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestWorkout = exports.lookupFoodNutrition = void 0;
const functions = require("firebase-functions");
const generative_ai_1 = require("@google/generative-ai");
const getGemini = () => {
    var _a;
    const apiKey = process.env.GEMINI_API_KEY || ((_a = functions.config().gemini) === null || _a === void 0 ? void 0 : _a.api_key);
    if (!apiKey)
        throw new Error('Gemini API key not configured. Set GEMINI_API_KEY in functions/.env');
    return new generative_ai_1.GoogleGenerativeAI(apiKey);
};
/**
 * AI Food Nutrition Lookup
 * Called when the regular food database can't find a match.
 * Returns estimated nutrition info for a given food/drink.
 */
exports.lookupFoodNutrition = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
    }
    const { query, servingSize } = data;
    if (!query || typeof query !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'Food query is required');
    }
    try {
        const genAI = getGemini();
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = `You are a nutrition database. Given a food or drink item, return ONLY a JSON object with estimated nutritional information. No markdown, no explanation, just the JSON.

Food item: "${query}"
Serving size: "${servingSize || 'standard serving'}"

Return this exact JSON format:
{
  "name": "the food/drink name (cleaned up)",
  "brand": "brand name if identifiable, otherwise empty string",
  "calories": number (kcal),
  "protein": number (grams),
  "carbs": number (grams),
  "fat": number (grams),
  "servingSize": "the serving size used",
  "confidence": "high" or "medium" or "low"
}

Be as accurate as possible. Use UK nutritional data where available. For branded items (like Costa, Starbucks, McDonald's etc), use the actual published nutritional data if you know it.`;
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        // Parse the JSON response, stripping any markdown code blocks
        const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const nutrition = JSON.parse(jsonStr);
        return {
            success: true,
            source: 'ai',
            data: {
                name: nutrition.name || query,
                brand: nutrition.brand || '',
                calories: Math.round(nutrition.calories || 0),
                protein: Math.round((nutrition.protein || 0) * 10) / 10,
                carbs: Math.round((nutrition.carbs || 0) * 10) / 10,
                fat: Math.round((nutrition.fat || 0) * 10) / 10,
                servingSize: nutrition.servingSize || servingSize || 'standard serving',
                confidence: nutrition.confidence || 'medium',
            },
        };
    }
    catch (error) {
        console.error('AI food lookup failed:', error);
        throw new functions.https.HttpsError('internal', 'Failed to look up food nutrition');
    }
});
/**
 * AI Workout Suggestion
 * Returns workout ideas based on a user query.
 */
exports.suggestWorkout = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
    }
    const { query, location, experience } = data;
    if (!query || typeof query !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'Workout query is required');
    }
    try {
        const genAI = getGemini();
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = `You are a personal training assistant. Generate a workout based on the user's request. Return ONLY a JSON object, no markdown, no explanation.

Request: "${query}"
Location: "${location || 'gym'}"
Experience level: "${experience || 'intermediate'}"

Return this exact JSON format:
{
  "name": "workout name",
  "description": "brief description of the workout",
  "duration": "estimated time in minutes",
  "exercises": [
    {
      "name": "exercise name",
      "sets": number,
      "reps": "rep range or time (e.g. '10-12' or '30 seconds')",
      "restSeconds": number,
      "notes": "form tips or modifications (optional)"
    }
  ],
  "tips": ["tip 1", "tip 2"]
}

Include 5-8 exercises. Make it practical and safe. Use proper exercise names. For home workouts, only use bodyweight or minimal equipment (dumbbells, resistance bands). For gym workouts, include a mix of compound and isolation movements.`;
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const workout = JSON.parse(jsonStr);
        return {
            success: true,
            data: workout,
        };
    }
    catch (error) {
        console.error('AI workout suggestion failed:', error);
        throw new functions.https.HttpsError('internal', 'Failed to generate workout suggestion');
    }
});
//# sourceMappingURL=ai.js.map