import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

export const TemporayStorageService = {
  getString: (path: string): string | null =>
    typeof window !== "undefined" && window.sessionStorage.getItem(path),
  setString: (path: string, value: string): void =>
    window.sessionStorage.setItem(path, value),
  removeString: (path: string): void => window.sessionStorage.removeItem(path),
};

const key = "__go_back_context__";

interface INavigationItem {
  link: string;
  title: string;
}

export const useNavigationStack = (title: string) => {
  const router = useRouter();
  const [history, setHistory] = useState<INavigationItem[]>(
    JSON.parse(TemporayStorageService.getString(key) || "[]")
  );
  useEffect(() => {
    console.log(history);
    TemporayStorageService.setString(key, JSON.stringify(history));
  }, [history]);
  return useMemo(
    () => ({
      history,
      pushToStack: () => {
        setHistory([
          ...history,
          {
            title,
            link: router.asPath,
          },
        ]);
      },
      goToLinkIndex: (index: number) => {
        const newHistory = [...history];

        let loopIndex = index;
        let lastHistory = newHistory[newHistory.length - 1];
        while (loopIndex > 0) {
          lastHistory = newHistory.pop();
          loopIndex -= 1;
        }

        setHistory(newHistory);
        router.replace(lastHistory.link);
      },
      goBack: () => {
        const newHistory = [...history];

        const lastHistory = newHistory.pop();

        setHistory(newHistory);
        router.replace(lastHistory.link);
      },
      canGoBack: () => history.length > 0,
    }),
    [typeof window]
  );
};
