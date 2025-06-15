import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Aplicacion from "./Aplicacion.jsx";

ReactDOM.render(
    <BrowserRouter>
        <Aplicacion />
    </BrowserRouter>,

    document.getElementById("app")
);


