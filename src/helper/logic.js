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
  middleBatch,
  setMiddleBatch,
  setPlayerTwoHand,
  playerTwoHand,
  setPlayerTwoStack
) => {
  const card = aiLogic(middleBatch, playerTwoHand);
  const index = playerTwoHand.indexOf(card);
  setMiddleBatch((prev) => [...prev, card]);
  setPlayerTwoHand(playerTwoHand.filter((c, i) => i !== index));
  if (
    (card.number === "J" && middleBatch.length > 0) ||
    card.number === middleBatch.at(-1)?.number
  ) {
    setTimeout(() => {
      setPlayerTwoStack((prev) => [...prev, ...middleBatch, card]);
      setMiddleBatch([]);
    }, 300);

    return true;
  }
};

export const playerTurn = (
  setMiddleBatch,
  setPlayerOneHand,
  playerOneHand,
  index,
  card,
  middleBatch,
  setPlayerOneStack
) => {
  setMiddleBatch((prev) => [...prev, card]);
  setPlayerOneHand(playerOneHand.filter((c, i) => i !== index));
  if (
    (card.number === "J" && middleBatch.length > 0) ||
    card.number === middleBatch.at(-1)?.number
  ) {
    setPlayerOneStack((prev) => [...prev, ...middleBatch, card]);
    setMiddleBatch([]);
    return true;
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
      setTimeout(() => {
        setHand((prev) => prev + 1);
        setPlayerOneHand(data?.playerOneCards[hand + 1]);
        setPlayerTwoHand(data?.playerTwoCards[hand + 1]);
      }, 300);
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

export const calculateCardValue = (deckOfCards) => {
  const newArray = [];
  for (const card of deckOfCards) {
    if (
      card.number === "A" ||
      card.number === "K" ||
      card.number === "Q" ||
      card.number === "J" ||
      card.number === "10" ||
      (card.number === "2" && card.suit === "clubs")
    )
      newArray.push(1);
    if (card.number === "10" && card.suit === "diamonds") {
      newArray.push(1);
    }
  }

  return newArray.reduce((a, b) => a + b, 0);
};

const giveThreePoints = (arr1, arr2) => {
  if (arr1.length > arr2.length) return 3;
  return 0;
};

export const declareTheWinner = (playerOneStack, playerTwoStack) => {
  console.log({
    player: playerOneStack,
    comp: playerTwoStack,
  });

  const playerOneTotalScore =
    calculateCardValue(playerOneStack) +
    giveThreePoints(playerOneStack, playerTwoStack);
  const computerTotalScore =
    calculateCardValue(playerTwoStack) +
    giveThreePoints(playerTwoStack, playerOneStack);

  if (playerOneTotalScore > computerTotalScore)
    return `You Won The Game ${playerOneTotalScore} to ${computerTotalScore}`;

  if (playerOneTotalScore < computerTotalScore)
    return `AI Won The Game ${computerTotalScore} to ${playerOneTotalScore}`;

  return `DRAW ${computerTotalScore} - ${playerOneTotalScore}`;
};
