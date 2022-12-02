export const getCardColor = (string) => {
  if (string === "hearts" || string === "diamonds") return true;

  return false;
};

export const getCardSymbol = (string) => {
  switch (string) {
    case "hearts":
      return <p>&#10084;</p>;
    case "spades":
      return <p>&#9824;</p>;
    case "diamonds":
      return <p>&#9670;</p>;
    default:
      return <p>&#9827;</p>;
  }
};
