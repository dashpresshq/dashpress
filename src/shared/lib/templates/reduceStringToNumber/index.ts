const ALPHABETS = Object.fromEntries(
  [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
  ].map((char, index) => [char, index])
);

export const reduceStringToNumber = (input: string): number => {
  return input
    .split("")
    .reduce((acc, char) => acc + (ALPHABETS[char.toUpperCase()] || 0), 0);
};
