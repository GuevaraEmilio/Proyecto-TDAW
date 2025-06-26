import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import Register from "./Register.jsx";
import Game from "./Game.js";
import Perfil from "./Perfil.jsx";
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min.js";

function Aplicacion() {
  return (
    <Switch>
     <Route exact path="/" component={Login} />
        <Route path="/Home" component={Home} />
        <Route path="/jugar" component={Game}/>
        <Route path="/Perfil" component={Perfil} />
        <Route path="/Register" component={Register} />
    </Switch>
  );
}

export default Aplicacion;
