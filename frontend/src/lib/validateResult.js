export function validateRecipe(data) {
  if (!data || typeof data !== "object") return null;
  if (typeof data.title !== "string" || !data.title) return null;
  if (!Array.isArray(data.ingredients) || data.ingredients.length === 0) return null;
  if (!Array.isArray(data.steps) || data.steps.length === 0) return null;
  if (typeof data.servings !== "number" || data.servings < 1) return null;

  // Validate each ingredient has required fields
  for (const ing of data.ingredients) {
    if (!ing.name || typeof ing.quantity !== "number" || !ing.unit) return null;
  }

  // Validate each step has required fields
  for (const step of data.steps) {
    if (typeof step.step !== "number" || !step.instruction) return null;
  }

  return data;
}
