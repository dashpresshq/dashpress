export function abbreviateNumber(value: number) {
  let newValue = value;
  const suffixes = ["", "K", "M", "B", "T"];
  let suffixNum = 0;
  while (newValue >= 1000) {
    newValue /= 1000;
    suffixNum += 1;
  }

  let newValueString =
    newValue.toString().length > 2
      ? newValue.toPrecision(3)
      : newValue.toPrecision();

  newValueString += suffixes[suffixNum];
  return newValueString;
}
