import { useEffect, useState } from "react";

const regressionMetrics = ["MSE", "RMSE", "MAE", "R²"];
const classificationMetrics = ["Accuracy", "Precision", "Recall", "F1 Score"];

const regressionDatasetFields = [
  { key: "samples", label: "Number of samples", type: "number", min: 20, max: 1000, step: 10, defaultValue: 100 },
  { key: "features", label: "Number of features", type: "number", min: 1, max: 10, defaultValue: 2 },
  { key: "noise", label: "Noise", type: "number", min: 0, max: 1, step: 0.1, defaultValue: 0.2 },
  { key: "relationship", label: "Relationship type", type: "select", defaultValue: "Linear", options: ["Linear", "Curved", "Mixed"] },
  { key: "randomState", label: "Random state", type: "number", min: 0, max: 9999, defaultValue: 42 },
];

const classificationDatasetFields = [
  { key: "samples", label: "Number of samples", type: "number", min: 20, max: 1000, step: 10, defaultValue: 100 },
  { key: "features", label: "Number of features", type: "number", min: 2, max: 10, defaultValue: 2 },
  { key: "classes", label: "Number of classes", type: "number", min: 2, max: 5, defaultValue: 2 },
  { key: "classSeparation", label: "Class separation", type: "number", min: 0.1, max: 5, step: 0.1, defaultValue: 1.5 },
  { key: "randomState", label: "Random state", type: "number", min: 0, max: 9999, defaultValue: 42 },
];

const classificationWithNoise = [
  ...classificationDatasetFields.slice(0, 4),
  { key: "noise", label: "Noise", type: "number", min: 0, max: 1, step: 0.1, defaultValue: 0.2 },
  classificationDatasetFields[4],
];

const algorithmSettings = {
  "Linear Regression": {
    type: "regression",
    description: "Models a straight-line relationship between input features and a continuous target.",
    datasetFields: regressionDatasetFields,
    parameterFields: [{ key: "fitIntercept", label: "Fit intercept", type: "checkbox", defaultValue: true }],
    details: ["Coefficients", "Intercept"],
    visualizationNote: "A regression line or plane can be rendered here after simulation.",
  },
  "Polynomial Regression": {
    type: "regression",
    description: "Extends linear regression with polynomial features to model curved relationships.",
    datasetFields: [
      ...regressionDatasetFields.slice(0, 2),
      { key: "relationship", label: "Relationship type", type: "select", defaultValue: "Curved", options: ["Curved", "Linear", "Mixed"] },
      ...regressionDatasetFields.slice(2, 3),
      regressionDatasetFields[4],
    ],
    parameterFields: [{ key: "degree", label: "Polynomial degree", type: "number", min: 2, max: 8, defaultValue: 3 }],
    details: ["Polynomial degree", "Coefficients"],
    visualizationNote: "A fitted curve or surface can be rendered here after simulation.",
  },
  "Decision Tree Regression": {
    type: "regression",
    description: "Splits feature space into rules to predict a continuous target value.",
    datasetFields: regressionDatasetFields,
    parameterFields: [
      { key: "maxDepth", label: "Maximum depth", type: "number", min: 1, max: 20, defaultValue: 5 },
      { key: "minSamplesLeaf", label: "Minimum samples per leaf", type: "number", min: 1, max: 50, defaultValue: 2 },
    ],
    details: ["Tree depth", "Number of leaves", "Feature importance"],
    visualizationNote: "A piecewise prediction surface can be rendered here after simulation.",
  },
  "Random Forest Regression": {
    type: "regression",
    description: "Combines many regression trees to make more stable continuous predictions.",
    datasetFields: regressionDatasetFields,
    parameterFields: [
      { key: "trees", label: "Number of trees", type: "number", min: 10, max: 500, step: 10, defaultValue: 100 },
      { key: "maxDepth", label: "Maximum depth", type: "number", min: 1, max: 20, defaultValue: 8 },
      { key: "minSamplesLeaf", label: "Minimum samples per leaf", type: "number", min: 1, max: 50, defaultValue: 2 },
    ],
    details: ["Number of trees", "Feature importance"],
    visualizationNote: "An ensemble prediction surface can be rendered here after simulation.",
  },
  "Support Vector Regression (SVR)": {
    type: "regression",
    description: "Fits a flexible continuous prediction function within a chosen error margin.",
    datasetFields: regressionDatasetFields,
    parameterFields: [
      { key: "kernel", label: "Kernel", type: "select", defaultValue: "RBF", options: ["RBF", "Linear", "Polynomial"] },
      { key: "c", label: "C", type: "number", min: 0.1, max: 100, step: 0.1, defaultValue: 1 },
      { key: "epsilon", label: "Epsilon", type: "number", min: 0.01, max: 2, step: 0.01, defaultValue: 0.1 },
    ],
    details: ["Kernel", "C", "Support vectors"],
    visualizationNote: "The fitted regression surface and support vectors can be rendered here.",
  },
  "Logistic Regression": {
    type: "classification",
    description: "Estimates class probabilities and assigns observations to discrete classes.",
    datasetFields: classificationDatasetFields,
    parameterFields: [
      { key: "c", label: "C", type: "number", min: 0.1, max: 100, step: 0.1, defaultValue: 1 },
      { key: "maxIterations", label: "Maximum iterations", type: "number", min: 50, max: 2000, step: 50, defaultValue: 300 },
    ],
    details: ["Coefficients", "Intercept"],
    visualizationNote: "A probability or decision boundary can be rendered here after simulation.",
  },
  "K-Nearest Neighbors (KNN)": {
    type: "classification",
    description: "Classifies each point from the labels of its closest neighboring data points.",
    datasetFields: classificationWithNoise,
    parameterFields: [
      { key: "neighbors", label: "Number of neighbors (K)", type: "number", min: 1, max: 50, defaultValue: 5 },
      { key: "weights", label: "Weights", type: "select", defaultValue: "Uniform", options: ["Uniform", "Distance"] },
    ],
    details: ["K value", "Neighbors information"],
    visualizationNote: "Neighbor regions and class clusters can be rendered here after simulation.",
  },
  "Decision Tree": {
    type: "classification",
    description: "Learns a sequence of feature-based decisions to classify each observation.",
    datasetFields: classificationDatasetFields,
    parameterFields: [
      { key: "maxDepth", label: "Maximum depth", type: "number", min: 1, max: 20, defaultValue: 5 },
      { key: "minSamplesLeaf", label: "Minimum samples per leaf", type: "number", min: 1, max: 50, defaultValue: 2 },
    ],
    details: ["Tree depth", "Number of leaves", "Feature importance"],
    visualizationNote: "Classification regions and split boundaries can be rendered here.",
  },
  "Random Forest": {
    type: "classification",
    description: "Combines many classification trees to improve accuracy and reduce overfitting.",
    datasetFields: classificationDatasetFields,
    parameterFields: [
      { key: "trees", label: "Number of trees", type: "number", min: 10, max: 500, step: 10, defaultValue: 100 },
      { key: "maxDepth", label: "Maximum depth", type: "number", min: 1, max: 20, defaultValue: 8 },
      { key: "minSamplesLeaf", label: "Minimum samples per leaf", type: "number", min: 1, max: 50, defaultValue: 2 },
    ],
    details: ["Number of trees", "Feature importance"],
    visualizationNote: "An ensemble decision boundary can be rendered here after simulation.",
  },
  "Support Vector Machine (SVM)": {
    type: "classification",
    description: "Finds a separating boundary with the widest possible margin between classes.",
    datasetFields: classificationWithNoise,
    parameterFields: [
      { key: "kernel", label: "Kernel", type: "select", defaultValue: "RBF", options: ["RBF", "Linear", "Polynomial"] },
      { key: "c", label: "C", type: "number", min: 0.1, max: 100, step: 0.1, defaultValue: 1 },
      { key: "gamma", label: "Gamma", type: "number", min: 0.01, max: 5, step: 0.01, defaultValue: 0.5 },
    ],
    details: ["Kernel", "C", "Support vectors"],
    visualizationNote: "The margin, support vectors, and decision boundary can be rendered here.",
  },
};

function getInitialValues(fields) {
  return fields.reduce((values, field) => ({ ...values, [field.key]: field.defaultValue }), {});
}

function createSeededRandom(seed) {
  const parsedSeed = Number(seed);
  let value = Math.max(1, Number.isFinite(parsedSeed) ? parsedSeed : 42) % 2147483647;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function createPreviewRows(datasetValues, algorithmType) {
  const totalRows = Math.min(Math.max(Number(datasetValues.samples) || 100, 10), 1000);
  const featureCount = Math.max(Number(datasetValues.features) || 2, 1);
  const random = createSeededRandom(datasetValues.randomState);
  const noise = Number(datasetValues.noise) || 0;
  const classes = Math.max(Number(datasetValues.classes) || 2, 2);
  const separation = Number(datasetValues.classSeparation) || 1;

  return Array.from({ length: totalRows }, (_, index) => {
    if (algorithmType === "classification") {
      const label = index % classes;
      const features = Array.from({ length: featureCount }, () => (label * separation) + ((random() - 0.5) * (1 + noise)));
      return { features, target: label };
    }

    const features = Array.from({ length: featureCount }, () => (random() * 10) - 5);
    const relationship = datasetValues.relationship || "Linear";
    const baseValue = relationship === "Curved"
      ? features[0] ** 2
      : relationship === "Mixed" ? (features[0] * 1.5) + Math.sin(features[0]) : features[0] * 2;
    return { features, target: baseValue + ((random() - 0.5) * noise * 4) };
  });
}

function Field({ field, value, onChange }) {
  const fieldId = `field-${field.key}`;

  if (field.type === "checkbox") {
    return <label className="setting-field checkbox-field" htmlFor={fieldId}><input id={fieldId} type="checkbox" checked={value} onChange={(event) => onChange(field.key, event.target.checked)} /><span>{field.label}</span></label>;
  }

  return (
    <label className="setting-field" htmlFor={fieldId}>
      <span>{field.label}</span>
      {field.type === "select" ? (
        <select id={fieldId} value={value} onChange={(event) => onChange(field.key, event.target.value)}>{field.options.map((option) => <option key={option}>{option}</option>)}</select>
      ) : <input id={fieldId} type="number" value={value} min={field.min} max={field.max} step={field.step || 1} onChange={(event) => onChange(field.key, event.target.value)} />}
    </label>
  );
}

function ControlPanel({ title, fields, values, onChange, children }) {
  return (
    <section className="control-panel">
      <div className="panel-heading"><p className="panel-kicker">{title}</p><h2>{title === "Dataset generation" ? "Create a synthetic dataset" : "Tune the model"}</h2></div>
      <div className="settings-grid">{fields.map((field) => <Field field={field} key={field.key} value={values[field.key]} onChange={onChange} />)}</div>
      {children}
    </section>
  );
}

function DatasetPreview({ rows, type }) {
  if (!rows.length) return <p className="preview-empty">Generate a dataset to see a small frontend-only preview.</p>;
  return (
    <div className="dataset-preview">
      <div className="preview-heading"><strong>Dataset preview</strong><span>{rows.length} generated rows</span></div>
      <div className="table-wrap"><table><thead><tr><th>#</th><th>Feature 1</th><th>Feature 2</th><th>{type === "regression" ? "Target" : "Class"}</th></tr></thead><tbody>
        {rows.slice(0, 5).map((row, index) => <tr key={index}><td>{index + 1}</td><td>{row.features[0].toFixed(2)}</td><td>{(row.features[1] ?? 0).toFixed(2)}</td><td>{type === "regression" ? row.target.toFixed(2) : row.target}</td></tr>)}
      </tbody></table></div>
    </div>
  );
}

function VisualizationWorkspace({ algorithm, note, rows, viewAngle, onRotate, onReset }) {
  return (
    <section className="visualization-workspace">
      <div className="visualization-header"><div><p className="panel-kicker">3D visualization</p><h2>Visualization workspace</h2></div><div className="view-controls"><button className="text-button" type="button" onClick={onRotate}>Rotate view</button><button className="text-button" type="button" onClick={onReset}>Reset view</button></div></div>
      <div className="visualization-canvas" style={{ "--view-angle": `${viewAngle}deg` }}>
        <div className="axis axis-x">X</div><div className="axis axis-y">Y</div><div className="axis axis-z">Z</div><div className="visualization-grid" aria-hidden="true" />
        <div className="visualization-placeholder"><span>Interactive 3D area</span><p>{rows.length ? `${rows.length} generated observations are ready to visualize.` : `Generate data for ${algorithm} to prepare this workspace.`}</p><small>{note}</small></div>
      </div>
    </section>
  );
}

function ResultsPanel({ hasRun, type, details, algorithm }) {
  const metrics = type === "regression" ? regressionMetrics : classificationMetrics;
  return (
    <section className="results-panel">
      <div className="results-header"><div><p className="panel-kicker">Results</p><h2>Simulation results</h2></div><span className={hasRun ? "status-badge ready" : "status-badge"}>{hasRun ? "Ready for backend results" : "Waiting to run"}</span></div>
      {hasRun ? <><div className="metric-grid">{metrics.map((metric) => <div className="metric-card" key={metric}><span>{metric}</span><strong>—</strong><small>Calculated after backend integration</small></div>)}</div><div className="algorithm-values"><h3>{algorithm} details</h3><div>{details.map((detail) => <span key={detail}>{detail}: <strong>—</strong></span>)}</div></div></> : <p className="results-empty">Generate a dataset, then run the simulation to prepare the relevant {type} metrics.</p>}
    </section>
  );
}

function Simulator({ category, algorithm, onBack }) {
  const settings = algorithmSettings[algorithm] || algorithmSettings["Linear Regression"];
  const [datasetValues, setDatasetValues] = useState(() => getInitialValues(settings.datasetFields));
  const [parameterValues, setParameterValues] = useState(() => getInitialValues(settings.parameterFields));
  const [datasetRows, setDatasetRows] = useState([]);
  const [hasRun, setHasRun] = useState(false);
  const [runMessage, setRunMessage] = useState("");
  const [viewAngle, setViewAngle] = useState(0);

  useEffect(() => {
    setDatasetValues(getInitialValues(settings.datasetFields));
    setParameterValues(getInitialValues(settings.parameterFields));
    setDatasetRows([]); setHasRun(false); setRunMessage(""); setViewAngle(0);
  }, [algorithm]);

  function updateDatasetValue(key, value) { setDatasetValues((current) => ({ ...current, [key]: value })); setHasRun(false); setRunMessage(""); }
  function updateParameterValue(key, value) { setParameterValues((current) => ({ ...current, [key]: value })); setHasRun(false); setRunMessage(""); }
  function generateDataset() { setDatasetRows(createPreviewRows(datasetValues, settings.type)); setHasRun(false); setRunMessage("Synthetic dataset generated in the browser."); }
  function runSimulation() {
    if (!datasetRows.length) { setRunMessage("Generate a dataset before running the simulation."); return; }
    // Send datasetRows, datasetValues, and parameterValues to FastAPI here later.
    setHasRun(true); setRunMessage("Simulation request is prepared for future backend integration.");
  }

  return (
    <main className="app-shell simulator-shell">
      <section className="page-container simulator-page">
        <header className="simulator-topbar"><button className="secondary-button" type="button" onClick={onBack}>← Back</button><div><span className="category-badge">{category}</span><h1>{algorithm}</h1><p>{settings.description}</p></div></header>
        <div className="simulator-workspace">
          <aside className="simulator-controls"><ControlPanel title="Dataset generation" fields={settings.datasetFields} values={datasetValues} onChange={updateDatasetValue}><button className="generate-button" type="button" onClick={generateDataset}>Generate Dataset</button><DatasetPreview rows={datasetRows} type={settings.type} /></ControlPanel><ControlPanel title="Algorithm parameters" fields={settings.parameterFields} values={parameterValues} onChange={updateParameterValue} /></aside>
          <VisualizationWorkspace algorithm={algorithm} note={settings.visualizationNote} rows={datasetRows} viewAngle={viewAngle} onRotate={() => setViewAngle((angle) => angle + 45)} onReset={() => setViewAngle(0)} />
        </div>
        <section className="run-section"><div><strong>Dataset: {datasetRows.length ? `${datasetRows.length} generated rows` : "not generated"}</strong><span>Frontend state is ready for a future FastAPI request.</span></div><button className="run-button" type="button" onClick={runSimulation}>Run Simulation</button></section>
        {runMessage && <p className="run-message" role="status">{runMessage}</p>}
        <ResultsPanel hasRun={hasRun} type={settings.type} details={settings.details} algorithm={algorithm} />
      </section>
    </main>
  );
}

export default Simulator;
