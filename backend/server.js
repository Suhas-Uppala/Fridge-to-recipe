import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const RECIPE_PROMPT = `You are a recipe generator. Given a list of ingredients, return ONLY valid JSON matching this exact shape, no prose, no markdown, no code fences:
{
  "title": "string",
  "description": "string",
  "servings": number,
  "prepTime": "string",
  "cookTime": "string",
  "ingredients": [
    { "name": "string", "quantity": number, "unit": "string", "swap": "string or null" }
  ],
  "steps": [
    { "step": number, "instruction": "string" }
  ],
  "tags": ["string"]
}

Rules:
- Use only the provided ingredients as the base, but you may add common pantry staples (salt, oil, water, etc.)
- Every ingredient must have a reasonable swap alternative (or null if none exists)
- Steps must be clear and numbered starting from 1
- Return ONLY the JSON object, nothing else

Ingredients: `;

app.post("/api/generate", async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || typeof ingredients !== "string" || !ingredients.trim()) {
    return res.status(400).json({ error: "Please provide ingredients." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });
    const result = await model.generateContent(RECIPE_PROMPT + ingredients);
    const text = result.response.text();

    // Strip markdown code fences if present
    const cleaned = text.replace(/```(?:json)?\n?/g, "").trim();

    const parsed = JSON.parse(cleaned);

    // Validate shape
    if (
      !parsed.title ||
      !Array.isArray(parsed.ingredients) ||
      !Array.isArray(parsed.steps) ||
      parsed.ingredients.length === 0 ||
      parsed.steps.length === 0
    ) {
      return res.status(502).json({ error: "AI returned an invalid recipe structure. Please retry." });
    }

    res.json(parsed);
  } catch (err) {
    console.error("Generate error:", err.message);
    if (err instanceof SyntaxError) {
      return res.status(502).json({ error: "AI returned malformed data. Please retry." });
    }
    res.status(500).json({ error: "Failed to generate recipe. Please try again." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
