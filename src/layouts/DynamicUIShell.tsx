import React, { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Layout: React.FC<{
  userId?: string;
  DynamicHeader?: React.LazyExoticComponent<any>;
}> = ({ userId, DynamicHeader }) => {
  // For demonstration: toggling the dynamic component display (user settings could drive this)
  const [showDynamic] = useState(true);
  console.log("Displaying customized UI for: ", userId);

  return (
    <div className="layout flex flex-col min-h-screen">
      <header className="shell-header" role="banner">
        Welcome user id {userId}
        {DynamicHeader !== undefined ? (
          <Suspense fallback={<Header />}>
            <DynamicHeader />
          </Suspense>
        ) : (
          <Header />
        )}
      </header>
      <nav role="navigation" aria-label="Main Navigation">
        {/* Navigation links would be added here */}
      </nav>
      <main role="main">
        {/* Render any static routed content */}
        <p>Test main content</p>
        <Outlet />
        {/* Render the dynamic federated component */}
        {/* {showDynamic && (
          <Suspense fallback={<div>Loading dynamic component...</div>}>
            <DynamicComponent userId={userId} />
          </Suspense>
        )} */}
      </main>
      <footer className="shell-footer" role="contentinfo">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
