import { ROOT_LINKS_TO_CLEAR_BREADCRUMBS } from "frontend/_layouts/app/constants";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { usePageTitleStore } from "./usePageTItle";

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
  viewKey: string;
}

const handleHistoryMutation = (
  oldHistory: INavigationItem[],
  newEntry: INavigationItem
): INavigationItem[] => {
  if (oldHistory.length === 0) {
    return [newEntry];
  }

  if (Object.values(ROOT_LINKS_TO_CLEAR_BREADCRUMBS).includes(newEntry.link)) {
    return [];
  }

  const lastHistory = oldHistory.at(-1);
  if (lastHistory.viewKey !== newEntry.viewKey) {
    return [...oldHistory, newEntry];
  }

  return [...oldHistory];
};

export const useNavigationStack = () => {
  const router = useRouter();
  const [history, setHistory] = useState<INavigationItem[]>(
    JSON.parse(TemporayStorageService.getString(key) || "[]")
  );
  const [pageTitle, viewKey] = usePageTitleStore((store) => [
    store.pageTitle,
    store.viewKey,
  ]);
  useEffect(() => {
    TemporayStorageService.setString(key, JSON.stringify(history));
  }, [history]);
  return useMemo(
    () => ({
      clear: () => {
        setHistory([]);
      },
      history,
      pushToStack: () => {
        if (!pageTitle) {
          return;
        }
        const newStackEntry = {
          title: pageTitle,
          link: router.asPath,
          viewKey,
        };
        const newHistory = handleHistoryMutation(history, newStackEntry);
        setHistory(newHistory);
      },
      goToLinkIndex: (index: number) => {
        const newHistory = [...history];

        let loopIndex = newHistory.length - index;
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
