import { useState, useRef, useCallback } from "react";
import PromptInput from "./components/PromptInput";
import RecipeView from "./components/RecipeView";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import { generateRecipe } from "./lib/api";
import { validateRecipe } from "./lib/validateResult";
import "./App.css";

export default function App() {
  const [state, setState] = useState("idle"); // idle | loading | success | error
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  const handleSubmit = useCallback(async (ingredients) => {
    const id = ++requestId.current;
    setState("loading");
    setError("");

    try {
      const data = await generateRecipe(ingredients);

      // Stale response guard
      if (id !== requestId.current) return;

      const validated = validateRecipe(data);
      if (!validated) {
        setError("AI returned an unexpected recipe format. Please try again.");
        setState("error");
        return;
      }

      setRecipe(validated);
      setState("success");
    } catch (err) {
      if (id !== requestId.current) return;
      setError(err.message || "Something went wrong. Please try again.");
      setState("error");
    }
  }, []);

  const handleRetry = () => setState("idle");
  const handleNewRecipe = () => {
    setState("idle");
    setRecipe(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <span className="logo-icon">🧊</span>
          Fridge to Recipe
          <span className="logo-icon">🍽️</span>
        </h1>
        <p className="subtitle">Turn your ingredients into delicious meals with AI</p>
      </header>

      <main className="app-main">
        {(state === "idle" || state === "loading") && (
          <PromptInput onSubmit={handleSubmit} isLoading={state === "loading"} />
        )}
        {state === "loading" && <LoadingState />}
        {state === "error" && <ErrorState message={error} onRetry={handleRetry} />}
        {state === "success" && recipe && (
          <RecipeView recipe={recipe} onNewRecipe={handleNewRecipe} />
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by AI · Built with React</p>
      </footer>
    </div>
  );
}
