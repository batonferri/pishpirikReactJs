import "./App.css";
import { useEffect, useState } from "react";
import { getCardColor, getCardSymbol } from "./helper/get";
import {
  aiTurn,
  declareTheWinner,
  endOfTurn,
  playerTurn,
} from "./helper/logic";
import { useQuery } from "./hooks/useQuery";

function App() {
  const [playerOneHand, setPlayerOneHand] = useState([[], []]);
  const [game, setGame] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const [playerOneStack, setPlayerOneStack] = useState([]);
  const [playerTwoStack, setPlayerTwoStack] = useState([]);
  const [playerTwoHand, setPlayerTwoHand] = useState([[], []]);
  const [middleBatch, setMiddleBatch] = useState([]);
  const [turn, setTurn] = useState(1);
  const [hand, setHand] = useState(0);
  const [lastTaker, setLastTaker] = useState(1);

  const { data } = useQuery("https://pishpirik-deal-card-api.vercel.app/api");

  useEffect(() => {
    if (!game) return;
    setPlayerOneHand(data?.playerOneCards[0]);
    setPlayerTwoHand(data?.playerTwoCards[0]);
    setMiddleBatch(data?.middleCards);
  }, [game]);

  const handlePlayerOneClick = (card, index) => {
    playerTurn(
      turn,
      setTurn,
      setMiddleBatch,
      setPlayerOneHand,
      playerOneHand,
      index,
      card,
      middleBatch,
      setPlayerOneStack,
      setLastTaker
    );
  };

  if (game && turn === 2) {
    aiTurn(
      setLastTaker,
      setTurn,
      middleBatch,
      setMiddleBatch,
      setPlayerTwoHand,
      playerTwoHand,
      setPlayerTwoStack
    );
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
              <div className="cardCount">{playerTwoStack.length}</div>
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
              <div className="cardCount">{playerOneStack.length}</div>
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
