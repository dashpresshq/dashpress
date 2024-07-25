import React from "react";

type delayedProps = {
  delayWait: number;
  children: React.ReactNode;
};

export function Delayed({ delayWait = 500, children }: delayedProps) {
  const [delayed, setDelayed] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setDelayed(false), delayWait);
    return () => {
      clearTimeout(timer);
    };
  }, [delayWait]);

  return !delayed && <div>{children}</div>;
}
