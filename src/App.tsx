import { lazy, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { ErrorBoundary } from "react-error-boundary";
import DynamicUIShell from "./layouts/DynamicUIShell";
import { init, loadRemote } from "@module-federation/enhanced/runtime";

/** This will be parameterized when hosted live
 * In this monorepo, its set at customized-components/vite.config.ts
 */
const hardcodedRemoteBaseUrl = "http://localhost:4173/assets/remoteEntry.js";

function App() {
  const [userId, setUserId] = useState("user-id-1");
  const [dynamicHeader, setDynamicHeader] =
    useState<React.LazyExoticComponent<any>>();

  useEffect(() => {
    if (!userId) {
      return;
    }

    // Global initialization when user id changes
    // TODO: Need to verify if init is called if userid changes or
    // if a different method is used
    init({
      name: "@main/app",
      remotes: [
        {
          name: "@customized/app",
          entry: hardcodedRemoteBaseUrl,
          alias: "customized",
        },
      ],
    });

    setDynamicHeader(
      lazy(async () => {
        try {
          const module = await loadRemote<{
            default: React.ComponentType<any>;
          }>(`customized/user-id-1-header`);
          // Ensure we never return null.
          if (module === null) {
            return {
              default: () => <div>Dynamic component not available</div>,
            };
          }
          return module;
        } catch (error) {
          console.error("Error loading remote component:", error);
          return {
            default: () => <div>Dynamic component not available</div>,
          };
        }
      })
    );
  }, [userId]);

  // Add this to your App.tsx for debugging

  // useEffect(() => {
  //   // Direct check of remote entry
  //   const checkRemoteEntry = async () => {
  //     try {
  //       console.log(
  //         "Attempting to fetch remote entry directly:",
  //         hardcodedRemoteBaseUrl
  //       );
  //       const response = await fetch(hardcodedRemoteBaseUrl);
  //       const text = await response.text();
  //       console.log(
  //         "Remote entry exists:",
  //         response.ok,
  //         "Content length:",
  //         text.length
  //       );

  //       console.debug(text);

  //       // Check if it contains the expected exports
  //       console.log(
  //         "Contains expected exports:",
  //         text.includes("user-id-1-header") && text.includes("user-id-2-header")
  //       );
  //     } catch (error) {
  //       console.error("Failed to fetch remote entry:", error);
  //     }
  //   };

  //   checkRemoteEntry();
  // }, []);
  return (
    <ErrorBoundary fallback={<div>Error loading dynamic content</div>}>
      <DynamicUIShell userId={userId} DynamicHeader={dynamicHeader} />
    </ErrorBoundary>
  );
}

export default App;
