import { useState } from "react";
import "./App.css";
import AlgorithmType from "./pages/Algorithmtype.jsx";
import AlgorithmList from "./pages/Algorithmlist.jsx";
import Simulator from "./pages/Simulator.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("type");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");

  function chooseCategory(category) {
    setSelectedCategory(category);
    setSelectedAlgorithm("");
    setCurrentPage("algorithms");
  }

  function chooseAlgorithm(algorithm) {
    setSelectedAlgorithm(algorithm);
    setCurrentPage("simulator");
  }

  function goToCategories() {
    setSelectedCategory("");
    setSelectedAlgorithm("");
    setCurrentPage("type");
  }

  function goToAlgorithms() {
    setSelectedAlgorithm("");
    setCurrentPage("algorithms");
  }

  if (currentPage === "algorithms") {
    return (
      <AlgorithmList
        category={selectedCategory}
        onSelectAlgorithm={chooseAlgorithm}
        onBack={goToCategories}
      />
    );
  }

  if (currentPage === "simulator") {
    return (
      <Simulator
        category={selectedCategory}
        algorithm={selectedAlgorithm}
        onBack={goToAlgorithms}
      />
    );
  }

  return <AlgorithmType onSelectCategory={chooseCategory} />;
}

export default App;
