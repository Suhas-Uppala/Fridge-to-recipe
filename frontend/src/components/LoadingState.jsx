export default function LoadingState() {
  return (
    <div className="loading-state">
      <div className="loading-animation">
        <div className="pan">🍳</div>
        <div className="steam">
          <span></span><span></span><span></span>
        </div>
      </div>
      <p className="loading-text">Cooking up your recipe...</p>
      <p className="loading-sub">Our AI chef is working its magic</p>
    </div>
  );
}
