import "./App.css";
import { useEffect, useState } from "react";
import { getCardColor, getCardSymbol } from "./helper/get";
import {
  aiTurn,
  calculateCardValue,
  checkIfCardHasPoints,
  checkIfCardIsPishpirik,
  declareTheWinner,
  endOfTurn,
  playerTurn,
  removeDuplicateObjectInArray,
} from "./helper/logic";
import { useQuery } from "./hooks/useQuery";

let turn = 1;
let lastTaker = 0;
function App() {
  const [game, setGame] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const [playerOneHand, setPlayerOneHand] = useState([[], []]);
  const [playerOneStack, setPlayerOneStack] = useState([]);
  const [playerOnePishpirik, setPlayerOnePishpirik] = useState([]);
  const [playerTwoHand, setPlayerTwoHand] = useState([[], []]);
  const [playerTwoStack, setPlayerTwoStack] = useState([]);
  const [playerTwoPishpirik, setPlayerTwoPishpirik] = useState([]);
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
      setPlayerOneStack,
      setPlayerOnePishpirik
    );
    turn = 2;
    lastTaker = player ? 1 : lastTaker;
  };

  if (game && turn === 2) {
    setTimeout(() => {
      const ai = aiTurn(
        middleBatch,
        setMiddleBatch,
        setPlayerTwoHand,
        playerTwoHand,
        setPlayerTwoStack,
        setPlayerTwoPishpirik
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
          <div className="cardCount">
            <p>Cards: {removeDuplicateObjectInArray(playerTwoStack)?.length}</p>
            <p>Points: {calculateCardValue(playerTwoStack)}</p>
            <p>
              Pishpirik:
              {removeDuplicateObjectInArray(playerTwoPishpirik)?.length}
            </p>
          </div>
          {!endGame ? (
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
          ) : (
            <div className="container containerFinalScreen">
              <div className="row rowFinalScreen">
                {removeDuplicateObjectInArray(playerTwoStack)?.map(
                  (card, i) => (
                    <div
                      key={i}
                      className={`card cardFinalScreen ${
                        getCardColor(card.suit) ? "cardColorRed" : ""
                      }`}
                      style={{
                        marginTop: checkIfCardHasPoints(card) ? "-20px" : 0,
                        border: checkIfCardIsPishpirik(card, playerTwoPishpirik)
                          ? "3px solid red"
                          : "",
                      }}
                    >
                      <div className="topNumber">{card.number}</div>
                      <div className="suit">{getCardSymbol(card.suit)}</div>
                    </div>
                  )
                )}
              </div>
              <div className="result" onClick={() => location.reload()}>
                {declareTheWinner(
                  playerOneStack,
                  playerTwoStack,
                  playerOnePishpirik,
                  playerTwoPishpirik
                )}
                <p className="endGameMessage">
                  Click Anywhere In The Text To Play Again
                </p>
              </div>
              <div className="row rowFinalScreen">
                {removeDuplicateObjectInArray(playerOneStack)?.map(
                  (card, i) => (
                    <div
                      key={i}
                      className={`card cardFinalScreen ${
                        getCardColor(card.suit) ? "cardColorRed" : ""
                      }`}
                      style={{
                        marginTop: checkIfCardHasPoints(card) ? "-20px" : 0,
                        border: checkIfCardIsPishpirik(card, playerOnePishpirik)
                          ? "3px solid red"
                          : "",
                      }}
                    >
                      <div className="topNumber">{card.number}</div>
                      <div className="suit">{getCardSymbol(card.suit)}</div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div className="cardCount">
            <p>Cards: {removeDuplicateObjectInArray(playerOneStack)?.length}</p>
            <p>Points: {calculateCardValue(playerOneStack)}</p>
            <p>
              Pishpirik:
              {removeDuplicateObjectInArray(playerOnePishpirik)?.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

//
export default App;
