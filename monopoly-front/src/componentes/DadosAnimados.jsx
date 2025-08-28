// src/componentes/DadosAnimados.jsx
import React, { useEffect, useState, useRef } from "react";
import "./DadosAnimados.css";

const DadosAnimados = ({ dado1, dado2, onFinish }) => {
  const [valorDado1, setValorDado1] = useState(1);
  const [valorDado2, setValorDado2] = useState(1);
  const [animando, setAnimando] = useState(true);
  const audioRef = useRef(null);

  // 🔄 Precarga del sonido UNA VEZ
  useEffect(() => {
    const audio = new Audio("/public/sonidos/sonido_dados_2s_ajustado.mp3");
    audio.load();
    audioRef.current = audio;
  }, []);

  // 🎲 Tirada de dados + sonido sincronizados
  useEffect(() => {
    if (!audioRef.current) return;

    const retrasoAnimacionMs = 400; // este es el nuevo valor para retrasar animación

    const reproducirSonido = () => {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch((e) =>
          console.warn("No se pudo reproducir el sonido:", e)
        );
      }
    };

    let intervalo;
    let timeout;
    let animacionTimeout;

    const iniciarAnimacion = () => {
      animacionTimeout = setTimeout(() => {
        intervalo = setInterval(() => {
          setValorDado1(Math.floor(Math.random() * 6) + 1);
          setValorDado2(Math.floor(Math.random() * 6) + 1);
        }, 100);

        timeout = setTimeout(() => {
          clearInterval(intervalo);
          setValorDado1(dado1);
          setValorDado2(dado2);
          setAnimando(false);

          setTimeout(() => {
            onFinish();
          }, 1200);
        }, 2000);
      }, retrasoAnimacionMs);
    };

    reproducirSonido();
    iniciarAnimacion();

    return () => {
      clearInterval(intervalo);
      clearTimeout(timeout);
      clearTimeout(animacionTimeout);
    };
  }, [dado1, dado2, onFinish]);

  return (
    <div className="contenedor-dados">
      <img
        src={`/dados/dado${valorDado1}.png`}
        alt={`Dado ${valorDado1}`}
        className={`dado-imagen ${animando ? "girando" : ""}`}
      />
      <img
        src={`/dados/dado${valorDado2}.png`}
        alt={`Dado ${valorDado2}`}
        className={`dado-imagen ${animando ? "girando" : ""}`}
      />
    </div>
  );
};

export default DadosAnimados;
