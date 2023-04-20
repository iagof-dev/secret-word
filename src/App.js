//CSS
import './App.css';

//Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

//REACT
import {useCallback, useEffect, useState} from "react";

//data
import {wordsList} from "./data/words";


const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
]

const guessesQty = 3;

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setguessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);


  const pickWordAndCategory = useCallback(() =>{
    //Categoria aleatorio
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    //Palavra aleatoria
    const word = words[category][Math.floor(Math.random() * Object.keys(categories).length)];

    return{word, category};
  }, [words]);

  //Iniciar jogo
  const startGame = useCallback(() => {
    //limpar todas as letras
    clearLetterStates();
    // pegar palavra e categoria
    const {word, category} = pickWordAndCategory();

    //array de letras
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase())

    //setar palavra e categoria
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // processo de entrada de letra
  const verifiyLetter = (letter) =>{
    const normalizedLetter = letter.toLowerCase();
    
    // verificar se a letra ja foi utilizada
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return;
    }

    // verificar se a letra existe na palavra
    if(letters.includes(normalizedLetter)){
      //letra correta
      setguessedLetters((actualGuessedLetters) =>[
        ...actualGuessedLetters,
        normalizedLetter
      ]);
    }
    else{
      //letra errada
      setWrongLetters((actualWrongLetters) =>[
        ...actualWrongLetters,
        normalizedLetter
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  }

  const clearLetterStates = () => {
    setguessedLetters([]);
    setWrongLetters([]);

  }
  // verificar se ganhou
  useEffect(() => {

      const uniqueLetters = [...new Set(letters)];

      // condição de vitória
      if (guessedLetters.length === uniqueLetters.length){
        //adicionar score
        setScore((actualScore) => actualScore += 100);
        // reiniciar jogo com uma nova palavra
        startGame();
      }

  }, [guessedLetters, letters, startGame])


  // verificar se as tentativas acabaram
  useEffect(() => {

    if(guesses <= 0){
      //Game over caso o numero de tentativas seja igual a 0
      clearLetterStates();
      setGameStage(stages[2].name);
    }

  }, [guesses]);

  const restartGame = () =>{
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && <Game verifiyLetter={verifiyLetter} pickedWord={pickedWord} pickedCategory={pickedCategory} letters={letters} guessedLetters={guessedLetters} wrongLetters={wrongLetters} guesses={guesses} score={score}/>}
      {gameStage === "end" && <GameOver restartGame={restartGame} score={score} />}

    </div>
  );
}

export default App;
