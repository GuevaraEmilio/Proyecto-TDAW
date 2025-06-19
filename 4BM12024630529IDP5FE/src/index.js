import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Aplicacion from "./Aplicacion.jsx";

// Usamos solo <Aplicacion />, que ya contiene el enrutamiento dentro
const rootElement = document.getElementById("app");
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <Aplicacion />
  </BrowserRouter>
);
