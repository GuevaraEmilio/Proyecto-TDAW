import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Aplicacion from "./Aplicacion.jsx";
import Home from "./home.jsx";
import { Route } from "react-router-dom/cjs/react-router-dom.min.js";

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Aplicacion/>}/>
            <Route path="/home" element={<Home/>}/>
        </Routes>
    </BrowserRouter>,

    document.getElementById("app")
);


