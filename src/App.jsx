import "./App.css";
import { useEffect, useState } from "react";
import { getCardColor, getCardSymbol } from "./helper/get";
import {
  aiTurn,
  calculateCardValue,
  declareTheWinner,
  endOfTurn,
  playerTurn,
} from "./helper/logic";
import { useQuery } from "./hooks/useQuery";

let turn = 1;
let lastTaker = 0;
function App() {
  const [playerOneHand, setPlayerOneHand] = useState([[], []]);
  const [game, setGame] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const [playerOneStack, setPlayerOneStack] = useState([]);
  const [playerTwoStack, setPlayerTwoStack] = useState([]);
  const [playerTwoHand, setPlayerTwoHand] = useState([[], []]);
  const [middleBatch, setMiddleBatch] = useState([]);
  const [hand, setHand] = useState(0);

  const { data } = useQuery("https://pishpirik-deal-card-api.vercel.app/api");

  useEffect(() => {
    if (!game) return;
    setPlayerOneHand(data?.playerOneCards[0]);
    setPlayerTwoHand(data?.playerTwoCards[0]);
    setMiddleBatch(data?.middleCards);
  }, [game]);

  const handlePlayerOneClick = (card, index) => {
    if (turn !== 1) return;
    const player = playerTurn(
      setMiddleBatch,
      setPlayerOneHand,
      playerOneHand,
      index,
      card,
      middleBatch,
      setPlayerOneStack
    );
    turn = 2;
    lastTaker = player ? 1 : lastTaker;
  };

  if (game && turn === 2) {
    if (turn !== 2) return;
    setTimeout(() => {
      const ai = aiTurn(
        middleBatch,
        setMiddleBatch,
        setPlayerTwoHand,
        playerTwoHand,
        setPlayerTwoStack
      );

      lastTaker = ai ? 2 : lastTaker;
      turn = 1;
    }, 1000);
  }

  endOfTurn(
    playerOneHand,
    playerTwoHand,
    hand,
    setHand,
    setPlayerOneHand,
    setPlayerTwoHand,
    data,
    lastTaker,
    setPlayerOneStack,
    setMiddleBatch,
    middleBatch,
    setPlayerTwoStack,
    setEndGame
  );

  return (
    <>
      {!game ? (
        <div className="startGameScreen">
          <button
            className="startGameBtn"
            onClick={() => {
              setGame((prev) => !prev);
            }}
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="App">
          {!endGame ? (
            <>
              <div className="cardCount">
                {calculateCardValue(playerTwoStack)}
              </div>
              <div className="container">
                <div className="row">
                  {playerTwoHand?.map((card, i) => (
                    <div key={i} className={"card back"} />
                  ))}
                </div>
                <div className="row middleBatch">
                  {middleBatch?.map((card, i) => (
                    <div
                      key={i}
                      className={`card ${
                        getCardColor(card.suit) ? "cardColorRed" : ""
                      }`}
                    >
                      <div className="topNumber">{card.number}</div>
                      <div className="suit">{getCardSymbol(card.suit)} </div>
                      <div className="bottomNumber">{card.number}</div>
                    </div>
                  ))}
                </div>
                <div className="row">
                  {playerOneHand?.map((card, i) => (
                    <div
                      key={i}
                      className={`card ${
                        getCardColor(card.suit) && "cardColorRed"
                      }`}
                      onClick={() => handlePlayerOneClick(card, i)}
                    >
                      <div className="topNumber">{card.number}</div>
                      <div className="suit">{getCardSymbol(card.suit)}</div>
                      <div className="bottomNumber">{card.number}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="cardCount">
                {calculateCardValue(playerOneStack)}
              </div>
            </>
          ) : (
            <div className="result" onClick={() => location.reload()}>
              {declareTheWinner(playerOneStack, playerTwoStack)}
              <p className="endGameMessage">
                Click Anywhere In The Screen To Play Again
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
