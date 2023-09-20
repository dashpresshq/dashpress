export function upperCaseFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function pluralize({
  count,
  singular,
  plural,
  inclusive,
}: {
  count: number;
  singular: string;
  plural?: string;
  inclusive?: boolean;
}): string {
  const computed = count === 1 ? singular : plural || `${singular}s`;

  return inclusive ? `${count} ${computed}` : computed;
}

export function ellipsis(word: string, length: number): string {
  return word.length > length ? `${word.slice(0, length)}...` : word;
}

export function sluggify(word: string, replacement = "-"): string {
  return word.toLowerCase().replace(/[^\w]/gi, replacement);
}

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
