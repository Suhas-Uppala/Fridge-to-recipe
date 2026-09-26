import { useState } from "react";

export default function PromptInput({ onSubmit, isLoading }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isLoading) onSubmit(text.trim());
  };

  return (
    <form className="prompt-input" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <span className="input-icon">🧊</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="List your ingredients... e.g. chicken, rice, garlic, soy sauce, ginger"
          rows={3}
          disabled={isLoading}
        />
      </div>
      <button type="submit" disabled={!text.trim() || isLoading}>
        {isLoading ? (
          <span className="btn-loading">
            <span className="spinner" />
            Cooking...
          </span>
        ) : (
          "🍳 Generate Recipe"
        )}
      </button>
    </form>
  );
}
