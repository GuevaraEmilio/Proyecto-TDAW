import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import * as tf from "@tensorflow/tfjs";
import * as speechCommands from "@tensorflow-models/speech-commands";
import "./App.css";
import styled from "styled-components";

//const tf = require('@tensorflow/tfjs');
const commands = require("@tensorflow-models/speech-commands");

const WALL_HEIGHT = 600;
const WALL_WIDTH = 400;
const BIRD_HEIGHT = 30;
const BIRD_WIDTH = 28;
const GRAVITY = 5;
const OBJ_WIDTH = 20;
const OBJ_GAP = 200;
const OBJ_SPEED = 6;

const Game = () => {
  const location = useLocation();
  const { name, id } = location.state || {};

  const [recognizer, setRecognizer] = useState(null);
  const [birdpos, setBirdpos] = useState(200);
  const [isStart, setStart] = useState(false);
  const [objHeight, setObjHeight] = useState(200);
  const [objPos, setObjPos] = useState(200);
  const [records, setRecords] = useState([]);
  const [score, setScore] = useState(0);
  const [isListening, setListening] = useState(false);
  const bottomObj = WALL_HEIGHT - OBJ_GAP - objHeight;

  useEffect(() => {
    fetch("http://localhost:9999/score")
      .then((response) => response.json())
      .then((data) => setRecords(data))
      .catch((err) => console.error("Error al obtener los puntajes:", err));
  }, []);

  //Se carga el modelo de IA al montar el componente
  useEffect(() => {
    loadModel();
  }, []);

  // useEffect(() => {
  //   listenCommand();
  // }, []);

  // useEffect(() => {
  //   let birdval;
  //   if (isStart && birdpos < WALL_HEIGHT - BIRD_HEIGHT) {
  //     birdval = setInterval(() => {
  //       setBirdpos((birdpos) => birdpos + GRAVITY);
  //     }, 24);
  //   }
  //   return () => clearInterval(birdval);
  // });

  useEffect(() => {
    let objVal;
    if (isStart & (objPos >= -OBJ_WIDTH)) {
      objVal = setInterval(() => {
        setObjPos((objPos) => objPos - OBJ_SPEED);
      }, 24);
    } else {
      setObjPos(WALL_WIDTH);
      setObjHeight(Math.floor(Math.random() * (WALL_HEIGHT - OBJ_GAP)));
      if (isStart) setScore((score) => score + 10);
    }
    return () => clearInterval(objVal);
  }, [isStart, objPos]);

  useEffect(() => {
    let topObj = birdpos >= 0 && birdpos < objHeight;
    let bottomObj =
      birdpos <= WALL_HEIGHT &&
      birdpos >=
        WALL_HEIGHT - (WALL_HEIGHT - OBJ_GAP - objHeight) - BIRD_HEIGHT;
    if (
      objPos >= OBJ_WIDTH &&
      objPos <= OBJ_WIDTH + 80 &&
      (topObj || bottomObj)
    ) {
      setStart(false);
      addScore();
      if (isListening) {
        recognizer.stopListening();
        setListening(false);
      }
      setBirdpos(300);
      setScore(0);
    }
  }, [isStart, birdpos, objHeight, objPos]);

  const loadModel = async () => {
    const recognizer = speechCommands.create("BROWSER_FFT", "directional4w");
    await recognizer.ensureModelLoaded();
    console.log("Etiquetas del modelo:", recognizer.wordLabels()); 
    setRecognizer(recognizer);
    console.log("Modelo de reconocimiento de voz cargado");
    console.log(recognizer.wordLabels());
  };

  const listenCommand = async () => {
    if (!recognizer) return;
    recognizer.listen(
      (result) => {
        let command = result.scores.indexOf(Math.max(...result.scores));
        console.log("command: ", result.scores);
        console.log(command);
        console.log("pasto");
        if (command === 0 && isStart && birdpos < WALL_HEIGHT - BIRD_HEIGHT) {
          setBirdpos((birdpos) => birdpos + 50);
        }
        if (command === 3) {
          if (birdpos < BIRD_HEIGHT) setBirdpos(0);
          else setBirdpos((birdpos) => birdpos - 50);
        }
      },
      {
        overlapFactor: 0.5,
        includeSpectogram: true,
        probabilityThreshold: 0.2,
      }
    );
    setListening(true);
  };

  const handler = () => {
    if (!isStart && !isListening) {
      setStart(true);
      listenCommand();
    }
    //  else if (birdpos < BIRD_HEIGHT) {
    //   setBirdpos(0);
    // } else {
    //   setBirdpos((birdpos) => birdpos - 50);
    // }
  };

  //Agrega el puntaje logrado a la base de datos una vez que el juego termina
  const addScore = async (e) => {
    try {
      await fetch("http://localhost:9999/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, score: parseInt(score) }),
      });
    } catch (err) {
      console.error("Error al enviar puntaje:", err);
    }
  };

  return (
    <Home onClick={handler}>
      <span>Score: {score}</span>
      <div>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Puntaje</th>
            </tr>
          </thead>

          <tbody>
            {records.length > 0 ? (
              records.map(({ username, score }, index) => (
                <tr key={index}>
                  <td>{username}</td>
                  <td>{score}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No hay registros aún</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Background height={WALL_HEIGHT} width={WALL_WIDTH}>
        {!isStart ? <StartGame>Click to start</StartGame> : null}
        <Obj
          height={objHeight}
          width={OBJ_WIDTH}
          left={objPos}
          top={0}
          deg={180}
        />
        <Bird
          height={BIRD_HEIGHT}
          width={BIRD_WIDTH}
          top={birdpos}
          left={100}
        />
        <Obj
          height={bottomObj}
          width={OBJ_WIDTH}
          left={objPos}
          top={WALL_HEIGHT - (objHeight + bottomObj)}
          deg={0}
        />
      </Background>
    </Home>
  );
};

export default Game;

const Home = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-item: center;
`;
const Background = styled.div`
  background-image: url(./images/bg.png);
  background-repeat: no-repeat;
  background-size: ${(props) => props.width}px ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border: 2px solid black;
  position: relative;
  overflow: hidden;
`;
const Bird = styled.div`
  position: absolute;
  background-image: url(./images/pajaro.png);
  background-repeat: no-repeat;
  background-size: ${(props) => props.width}px ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
`;

const StartGame = styled.div`
  text-align: center;
  position: relative;
  top: 49%;
  background-color: black;
  padding: 10px;
  width: 100px;
  left: 50%;
  margin-left: -55px;
  color: #ffffff;
  font-size: 20px;
  border-radius: 10px;
`;

const Obj = styled.div`
  position: relative;
  background-image: url(./images/pipe.png);
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  transform: rotate(${(props) => props.deg});
`;
