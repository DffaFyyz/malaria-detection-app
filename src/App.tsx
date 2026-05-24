import { useEffect, useState } from "react";
import { Shell } from "./components/Shell";
import { FeatureExtraction } from "./pages/FeatureExtraction";
import { Home } from "./pages/Home";
import { Predict } from "./pages/Predict";
import { ResearchInsights } from "./pages/ResearchInsights";

function getCurrentPath() {
  const path = window.location.pathname;
  if (path === "/predict" || path === "/research" || path === "/features") return path;
  return "/";
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(getCurrentPath());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(path: string) {
    window.history.pushState({}, "", path);
    setCurrentPath(getCurrentPath());
  }

  return (
    <Shell currentPath={currentPath} onNavigate={navigate}>
      {currentPath === "/predict" ? <Predict /> : null}
      {currentPath === "/research" ? <ResearchInsights /> : null}
      {currentPath === "/features" ? <FeatureExtraction /> : null}
      {currentPath === "/" ? <Home onNavigate={navigate} /> : null}
    </Shell>
  );
}
