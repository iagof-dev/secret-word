import React from 'react'

import "./GameOver.css";

const GameOver = ({restartGame, score}) => {
  return (
    <div>
        <h1>Fim de Jogo!</h1>
        <h2>Sua pontuação foi: <span>{score}</span></h2>
        <button onClick={restartGame}>Reiniciar jogo</button>
    </div>
  )
}

export default GameOver