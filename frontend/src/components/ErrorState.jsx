export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state">
      <div className="error-icon">⚠️</div>
      <h3>Something went wrong</h3>
      <p>{message}</p>
      <button className="retry-btn" onClick={onRetry}>🔄 Try Again</button>
    </div>
  );
}
