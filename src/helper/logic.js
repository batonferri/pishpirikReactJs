const aiLogic = (mid, array) => {
  const middleCard = mid.at(-1)?.number;
  const find = array.find((e) => e.number === middleCard);
  if (find) return find;
  const j = array.find((e) => e.number === "J");
  if (j && middleCard) return j;
  if (array[0].number === "J") return array[1];
  return array[0];
};

export const aiTurn = (
  setLastTaker,
  setTurn,
  middleBatch,
  setMiddleBatch,
  setPlayerTwoHand,
  playerTwoHand,
  setPlayerTwoStack
) => {
  const card = aiLogic(middleBatch, playerTwoHand);
  const index = playerTwoHand.indexOf(card);
  setTimeout(() => {
    setMiddleBatch((prev) => [...prev, card]);
    setPlayerTwoHand(playerTwoHand.filter((c, i) => i !== index));
    if (
      (card.number === "J" && middleBatch.length > 0) ||
      card.number === middleBatch.at(-1)?.number
    ) {
      setTimeout(() => {
        setPlayerTwoStack((prev) => [...prev, ...middleBatch, card]);
        setMiddleBatch([]);
      }, 400);
      setLastTaker(2);
    }
  }, 1000);
  setTurn((prev) => prev - 1);
};

export const playerTurn = (
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
) => {
  if (turn !== 1) return;

  setTimeout(() => {
    setTurn((prev) => prev + 1);
  }, 500);
  setMiddleBatch((prev) => [...prev, card]);
  setPlayerOneHand(playerOneHand.filter((c, i) => i !== index));

  if (
    (card.number === "J" && middleBatch.length > 0) ||
    card.number === middleBatch.at(-1)?.number
  ) {
    setTimeout(() => {
      setPlayerOneStack((prev) => [...prev, ...middleBatch, card]);
      setMiddleBatch([]);
      setLastTaker(1);
    }, 400);

    return;
  }
};

export const endOfTurn = (
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
) => {
  if (playerOneHand?.length < 1 && playerTwoHand?.length < 1) {
    if (hand >= 6) return;

    if (hand < 5) {
      setHand((prev) => prev + 1);
      setPlayerOneHand(data?.playerOneCards[hand + 1]);
      setPlayerTwoHand(data?.playerTwoCards[hand + 1]);
      return;
    }

    setTimeout(() => {
      if (lastTaker === 1) {
        setPlayerOneStack((prev) => [...prev, ...middleBatch]);
        setTimeout(() => {
          setMiddleBatch([]);
        }, 700);
      } else {
        setPlayerTwoStack((prev) => [...prev, ...middleBatch]);
        setTimeout(() => {
          setMiddleBatch([]);
        }, 700);
      }
    }, 100);

    setTimeout(() => {
      setEndGame(true);
    }, 800);
    setHand((prev) => prev + 1);
  }
};

export const declareTheWinner = (playerOneStack, playerTwoStack) => {
  if (playerOneStack.length > playerTwoStack.length)
    return `You Won The Game ${playerOneStack.length} to ${playerTwoStack.length}`;

  if (playerOneStack.length < playerTwoStack.length)
    return `AI Won The Game ${playerTwoStack.length} to ${playerOneStack.length}`;

  return `DRAW ${playerTwoStack.length} - ${playerOneStack.length}`;
};
