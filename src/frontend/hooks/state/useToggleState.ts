import { useState } from "react";

export const useToggle = (defaultValue = false) => {
  const [isOn, setIsOn] = useState(defaultValue);
  const on = () => setIsOn(true);
  const off = () => setIsOn(false);
  const set = (value: boolean) => setIsOn(value);
  const toggle = () => setIsOn((prevIsOn) => !prevIsOn);
  return { isOn, isOff: !isOn, on, off, toggle, set };
};
