import React, { Component } from 'react';
import ReactDOM from "react-dom";
import Login from './Login.jsx';
import { createRoot } from 'react-dom/client';
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';
 
class Aplicacion extends React.Component {
  render() {
    return (
    <div>
      <Login />                  
    </div>    
    );
  }
}
 
export default Aplicacion;

//CODIGO ACTUALIZADO PAREA LA NUEVA VERSION DE REACT
const rootElement = document.getElementById("app");
const root = createRoot(rootElement);
root.render(<Aplicacion />);

