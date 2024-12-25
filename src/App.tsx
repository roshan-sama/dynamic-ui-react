import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { ErrorBoundary } from "react-error-boundary";
import DynamicUIShell from "./layouts/DynamicUIShell";

function App() {
  const [count, setCount] = useState(0);

  return (
    <ErrorBoundary fallback={<div>Error loading dynamic content</div>}>
      <DynamicUIShell />
    </ErrorBoundary>
  );
}

export default App;
