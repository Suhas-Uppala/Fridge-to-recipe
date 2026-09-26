import { useState } from "react";

export default function RecipeView({ recipe, onNewRecipe }) {
  const [servings, setServings] = useState(recipe.servings);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [swappedIngredients, setSwappedIngredients] = useState(new Set());

  const scale = servings / recipe.servings;

  const toggleStep = (stepNum) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.has(stepNum) ? next.delete(stepNum) : next.add(stepNum);
      return next;
    });
  };

  const toggleSwap = (index) => {
    setSwappedIngredients((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const progress = Math.round((completedSteps.size / recipe.steps.length) * 100);

  return (
    <div className="recipe-view fade-in">
      {/* Header */}
      <div className="recipe-header">
        <div className="recipe-title-row">
          <h2>{recipe.title}</h2>
          <button className="new-recipe-btn" onClick={onNewRecipe}>+ New Recipe</button>
        </div>
        <p className="recipe-desc">{recipe.description}</p>
        <div className="recipe-meta">
          {recipe.prepTime && <span className="meta-chip">🔪 Prep: {recipe.prepTime}</span>}
          {recipe.cookTime && <span className="meta-chip">🔥 Cook: {recipe.cookTime}</span>}
          {recipe.tags?.map((tag) => (
            <span key={tag} className="meta-chip tag-chip">#{tag}</span>
          ))}
        </div>
      </div>

      {/* Servings Scaler */}
      <div className="servings-control">
        <span className="servings-label">🍽️ Servings</span>
        <div className="servings-buttons">
          <button onClick={() => setServings((s) => Math.max(1, s - 1))} disabled={servings <= 1}>−</button>
          <span className="servings-count">{servings}</span>
          <button onClick={() => setServings((s) => s + 1)}>+</button>
        </div>
      </div>

      {/* Ingredients */}
      <div className="recipe-section">
        <h3>📝 Ingredients</h3>
        <ul className="ingredients-list">
          {recipe.ingredients.map((ing, i) => {
            const isSwapped = swappedIngredients.has(i);
            const displayName = isSwapped && ing.swap ? ing.swap : ing.name;
            const qty = Math.round(ing.quantity * scale * 100) / 100;

            return (
              <li key={i} className="ingredient-item">
                <span className="ingredient-qty">{qty} {ing.unit}</span>
                <span className="ingredient-name">{displayName}</span>
                {ing.swap && (
                  <button
                    className={`swap-btn ${isSwapped ? "swapped" : ""}`}
                    onClick={() => toggleSwap(i)}
                    title={isSwapped ? `Switch back to ${ing.name}` : `Swap with ${ing.swap}`}
                  >
                    🔄 {isSwapped ? ing.name : ing.swap}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
        <span className="progress-text">{progress}% complete</span>
      </div>

      {/* Steps */}
      <div className="recipe-section">
        <h3>👨‍🍳 Steps</h3>
        <ol className="steps-list">
          {recipe.steps.map((s) => (
            <li
              key={s.step}
              className={`step-item ${completedSteps.has(s.step) ? "completed" : ""}`}
              onClick={() => toggleStep(s.step)}
            >
              <div className="step-checkbox">
                {completedSteps.has(s.step) ? "✅" : <span className="step-number">{s.step}</span>}
              </div>
              <p>{s.instruction}</p>
            </li>
          ))}
        </ol>
      </div>

      {progress === 100 && (
        <div className="completion-banner fade-in">
          🎉 Recipe complete! Enjoy your meal!
        </div>
      )}
    </div>
  );
}
