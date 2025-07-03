import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom/cjs/react-router-dom.min";
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
const y = WALL_HEIGHT - BIRD_HEIGHT;

const Game = () => {
  const location = useLocation();
  const history = useHistory();
  // Obtén el nombre del usuario desde la navegación o localStorage
  const username =
    location.state?.user?.username ||
    localStorage.getItem("username") ||
    "Invitado";
  const id =
    location.state?.user?.id ||
    location.state?.id ||
    null;

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
        if (command === 0 && (birdpos < y)) {
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
    // else{
    //   setBirdpos((birdpos) => birdpos + 50);
    // }
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

  useEffect(() => {
    let audioContext;
    let analyser;
    let dataArray;
    let source;
    let animationId;

    async function startMicVolume() {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      dataArray = new Uint8Array(analyser.frequencyBinCount);

      function checkVolume() {
        analyser.getByteTimeDomainData(dataArray);
        // Calcula el volumen RMS
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          let val = (dataArray[i] - 128) / 128;
          sum += val * val;
        }
        const rms = Math.sqrt(sum / dataArray.length);

        // Si el volumen supera el umbral, mueve el personaje hacia arriba
        if (rms > 0.08 && isStart) {
          setBirdpos((pos) => Math.max(0, pos - 40));
        }

        animationId = requestAnimationFrame(checkVolume);
      }

      checkVolume();
    }

    if (isStart) {
      startMicVolume();
    }

    // Limpieza: solo intenta detener el recognizer si está escuchando realmente
    return () => {
      if (audioContext) audioContext.close();
      if (animationId) cancelAnimationFrame(animationId);
      // Solo intenta detener el recognizer si existe y está escuchando
      if (
        recognizer &&
        typeof recognizer.stopListening === "function" &&
        typeof recognizer.isListening === "function"
      ) {
        // isListening() es síncrono y retorna un booleano
        if (recognizer.isListening()) {
          try {
            recognizer.stopListening();
          } catch (e) {
            // Ignora el error si no estaba escuchando
          }
        }
      }
    };
  }, [isStart]);

  return (
    <GameWrapper>
      <GameInfoBox>
        <div style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#222" }}>
          Nombre: {username}
        </div>
        <div
          style={{
            fontSize: "1.2rem",
            color: "#222",
            marginTop: "10px",
            background: "rgba(0,0,0,0.08)", // 40% más opaco sobre blanco
            borderRadius: "6px",
            padding: "6px 12px",
            display: "inline-block",
          }}
        >
          Puntaje: {score}
        </div>
        <div style={{ marginTop: "18px", color: "#555" }}>
          {records.length > 0 ? (
            records.map(({ username, score }, index) => (
              <div key={index}>
                {username}: {score}
              </div>
            ))
          ) : (
            <div>No hay registros aún</div>
          )}
        </div>
      </GameInfoBox>
      <Background height={WALL_HEIGHT} width={WALL_WIDTH} onClick={handler}>
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
      <BottomButton onClick={() => history.push("/")}>
        Volver al inicio de sesión
      </BottomButton>
    </GameWrapper>
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
  background-image: url(./images/fondojuego.jpg);
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
  background-image: url("/images/tiburon.png"); // Usa ruta absoluta desde public/
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

// Agrega este styled-component para el fondo general
const GameWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  background-image: url("/media/fondo2.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

// Caja blanca opaca para nombre y puntaje
const GameInfoBox = styled.div`
  position: fixed; // <-- Cambia a fixed
  top: 40px;
  left: 40px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 24px 36px;
  min-width: 220px;
  z-index: 10;
  text-align: left;
  border: 2px solid rgba(255, 255, 255, 0.7);
  pointer-events: auto;
`;
const UserNameBox = styled.div`
  position: absolute;
  top: 30px;
  right: 40px;
  background: rgba(255, 255, 255, 0.7);
  color: #222;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 1.2rem;
  font-weight: bold;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;
const BottomButton = styled.button`
  position: fixed;
  right: 32px;
  bottom: 32px;
  background: rgba(255,255,255,0.7);
  color: #222;
  border: 1px solid #bbb;
  border-radius: 8px;
  padding: 12px 32px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  z-index: 20;
`;

