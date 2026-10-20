const algorithmsByCategory = {
  Regression: [
    "Linear Regression",
    "Polynomial Regression",
    "Decision Tree Regression",
    "Random Forest Regression",
    "Support Vector Regression (SVR)",
  ],
  Classification: [
    "Logistic Regression",
    "K-Nearest Neighbors (KNN)",
    "Decision Tree",
    "Random Forest",
    "Support Vector Machine (SVM)",
  ],
};

function AlgorithmList({ category, onSelectAlgorithm, onBack }) {
  const algorithms = algorithmsByCategory[category] || [];

  return (
    <main className="app-shell">
      <section className="page-container">
        <div className="page-toolbar">
          <button className="secondary-button" type="button" onClick={onBack}>
            ← Back
          </button>
          <div>
            <span className="category-badge">{category}</span>
            <h1>Choose an algorithm</h1>
          </div>
        </div>

        <p className="section-description">
          Select an algorithm to open its simulator setup.
        </p>

        <div className="algorithm-list">
          {algorithms.map((algorithm, index) => (
            <button
              className="algorithm-card"
              key={algorithm}
              type="button"
              onClick={() => onSelectAlgorithm(algorithm)}
            >
              <span className="algorithm-number">{index + 1}</span>
              <h3>{algorithm}</h3>
              <span aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default AlgorithmList;
