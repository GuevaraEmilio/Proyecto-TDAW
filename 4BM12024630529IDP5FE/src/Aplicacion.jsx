import React, { Component } from 'react';
import ReactDOM from "react-dom";
// Importamos el componente
import Hola from './Hola.jsx';
import Login from './Login.jsx';
import { createRoot } from 'react-dom/client';
 
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

