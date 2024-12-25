import React, { useState, useEffect, Suspense } from "react";
import { AlertDialog } from "@radix-ui/react-alert-dialog";

// Main application shell that handles dynamic UI composition
const DynamicUIShell = () => {
  const [uiConfig, setUIConfig] = useState(null);
  const [sandboxedComponents, setSandboxedComponents] = useState<any>([]);

  // Fetch personalized UI configuration
  useEffect(() => {
    const fetchUIConfig = async () => {
      try {
        const response = await fetch("/api/personalized-ui");
        const config = await response.json();
        setUIConfig(config);

        // Load dynamic components based on configuration
        const components: any = await Promise.all(
          config.components.map(async (component: any) => {
            // Use dynamic import for module federation
            const RemoteComponent = React.lazy(
              () => import(`${component.remoteUrl}/${component.moduleName}`)
            );
            return {
              id: component.id,
              component: RemoteComponent,
              placement: component.placement,
              permissions: component.permissions,
            };
          })
        );
        setSandboxedComponents(components);
      } catch (error) {
        console.error("Error loading personalized UI:", error);
      }
    };

    fetchUIConfig();
  }, []);

  // Render dynamic components based on placement
  const renderComponents = (placement: any) => {
    const componentsForPlacement = sandboxedComponents.filter(
      (comp: any) => comp.placement === placement
    );

    return componentsForPlacement.map(
      ({ id, component: Component, permissions }: any) => (
        <div key={id} className="relative">
          <Suspense fallback={<div className="p-4">Loading...</div>}>
            {permissions.iframe ? (
              <iframe
                className="w-full h-full border-0"
                srcDoc={`
                <!DOCTYPE html>
                <html>
                  <body>
                    <div id="root"></div>
                    <script type="module">
                      import Component from '${Component.remoteUrl}/${
                  Component.moduleName
                }';
                      ReactDOM.render(
                        <Component 
                          data={window.parent.getSecureData(${JSON.stringify(
                            permissions.data
                          )})}
                          onEvent={window.parent.handleSecureEvent}
                        />,
                        document.getElementById('root')
                      );
                    </script>
                  </body>
                </html>
              `}
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <Component
                //@ts-ignore
                data={getSecureData(permissions.data)}
                //@ts-ignore
                onEvent={handleSecureEvent}
              />
            )}
          </Suspense>
        </div>
      )
    );
  };

  if (!uiConfig) {
    return <AlertDialog>Loading personalized experience...</AlertDialog>;
  }

  return (
    <div className="relative">
      {/* Header placement */}
      <div className="mb-4">{renderComponents("header")}</div>

      {/* Main content */}
      <div className="grid grid-cols-12 gap-4">
        {/* Sidebar placement */}
        <div className="col-span-3">{renderComponents("sidebar")}</div>

        {/* Content placement */}
        <div className="col-span-9">{renderComponents("content")}</div>
      </div>

      {/* Modal/popup container */}
      <div className="fixed inset-0 pointer-events-none">
        {renderComponents("overlay")}
      </div>
    </div>
  );
};

export default DynamicUIShell;
