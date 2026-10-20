function AlgorithmType({ onSelectCategory }) {
  return (
    <main className="app-shell">
      <section className="page-container">
        <header className="page-header">
          <h1>ML Algorithm Simulator</h1>
          <p className="subtitle">
            Choose the type of machine learning algorithm you want to explore.
          </p>
        </header>

        <div className="card-grid">
          <button
            className="choice-card regression"
            type="button"
            onClick={() => onSelectCategory("Regression")}
          >
            <span className="choice-icon" aria-hidden="true">📈</span>
            <h2>Regression</h2>
            <p>Explore algorithms that predict continuous values, such as price or temperature.</p>
          </button>

          <button
            className="choice-card classification"
            type="button"
            onClick={() => onSelectCategory("Classification")}
          >
            <span className="choice-icon" aria-hidden="true">⊞</span>
            <h2>Classification</h2>
            <p>Explore algorithms that sort data into clear categories or groups.</p>
          </button>
        </div>
      </section>
    </main>
  );
}

export default AlgorithmType;
