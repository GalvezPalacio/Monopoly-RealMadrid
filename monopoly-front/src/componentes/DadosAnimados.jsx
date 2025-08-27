// src/componentes/DadosAnimados.jsx
import React, { useEffect, useState } from "react";
import "./DadosAnimados.css";

const DadosAnimados = ({ dado1, dado2, onFinish }) => {
  const [valorDado1, setValorDado1] = useState(1);
  const [valorDado2, setValorDado2] = useState(1);
  const [animando, setAnimando] = useState(true);

  useEffect(() => {
    // Empieza la animación simulando tirada aleatoria
    const intervalo = setInterval(() => {
      setValorDado1(Math.floor(Math.random() * 6) + 1);
      setValorDado2(Math.floor(Math.random() * 6) + 1);
    }, 100);

    // Parar animación tras 2 segundos y mostrar valores reales
    const timeout = setTimeout(() => {
      clearInterval(intervalo);
      setValorDado1(dado1);
      setValorDado2(dado2);
      setAnimando(false);

      // Esperar un poco para dejar ver los dados reales
      setTimeout(() => {
        onFinish();
      }, 1200);
    }, 2000);

    return () => {
      clearInterval(intervalo);
      clearTimeout(timeout);
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
