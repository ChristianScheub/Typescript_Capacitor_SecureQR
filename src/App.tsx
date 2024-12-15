import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useSwipeNavigation } from "./Services/helper/navigationUtils";
import { useDeviceCheck } from "./Services/helper/useDeviceCheck";
import { makeStatusBarTransparent } from "./Services/helper/statusBarUtils";
import "./i18n";
import { getRoutes } from "./routes";
import NavbarView from "./Views/NavBar/NavbarView";
import { AdManager } from "./Services/Ads/AdManager";

const MainApp: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>("home");
  const isDesktop = useDeviceCheck();
  
  const handlers = useSwipeNavigation({
    navLinks: [
      { path: "/", component: "home" },
      { path: "/reader", component: "reader" },
      { path: "/info", component: "info" }
    ],
    activeComponent,
    setActiveComponent,
    enable: true,
  });

  makeStatusBarTransparent();

  return (
    <>
      <AdManager />
      <div {...handlers} style={{ paddingTop: "9vh" }} className={isDesktop ? "desktop" : ""}>
        <NavbarView setActiveComponent={setActiveComponent} activeComponent={activeComponent} />
        {getRoutes()}
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <MainApp />
    </Router>
  );
};

export default App;