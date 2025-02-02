const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = 3002;

// Enable CORS for all routes
app.use(cors());

// SSE Endpoint
app.get("/recipeStream", async (req, res) => {

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const generatedText = await fetchGeminiCompletionsStream(req.query);
    return res.status(200).json({
      recipe: generatedText
    });
  } catch (error) {
    console.error("Error generating recipe:", error);
  }

  req.on("close", () => {
    res.end();
  });
});

async function fetchGeminiCompletionsStream(params) {
  const ingredients = params.ingredients;
  const mealType = params.mealType;
  const cuisine = params.cuisine;
  const cookingTime = params.cookingTime;
  const complexity = params.complexity;
  
  const prompt = [
    "Generate a recipe that incorporates the following details:",
    `[Ingredients: ${ingredients}]`,
    `[Meal Type: ${mealType}]`,
    `[Cuisine Preference: ${cuisine}]`,
    `[Cooking Time: ${cookingTime}]`,
    `[Complexity: ${complexity}]`,
    "Please provide a detailed recipe, including steps for preparation and cooking. Only use the ingredients provided.",
    "The recipe should highlight the fresh and vibrant flavors of the ingredients.",
    "Also give the recipe a suitable name in its local language based on cuisine preference."
  ].join(" ");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
    
  const generatedText = result.response.text();

  return generatedText
}
// {"conversationId":"dbe8f50f-f73a-42be-8b96-cea401bdce19","source":"instruct"}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});