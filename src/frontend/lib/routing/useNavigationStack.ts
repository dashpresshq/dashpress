import { createStore } from "frontend/lib/store";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { TemporayStorageService } from "frontend/lib/storage";
import { usePageDetailsStore } from "./usePageDetails";

const key = "__navigation_stack__";

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

  const lastHistory = oldHistory.at(-1);
  // If the viewkey is the last then dont update it
  if (lastHistory.viewKey === newEntry.viewKey) {
    const clone = [...oldHistory];
    clone.pop();
    return [...clone, newEntry];
  }

  const historyIndex = oldHistory.findIndex(
    (old) => old.link === newEntry.link
  );

  if (historyIndex === -1) {
    return [...oldHistory, newEntry];
  }

  return oldHistory.slice(0, historyIndex + 1);
};

type IStore = {
  history: INavigationItem[];
  setHistory: (history: INavigationItem[]) => void;
};

/** This has to be createStore instead of useState so that the vaule is persisted through all pages */
const useNavigationHistoryStore = createStore<IStore>((set) => ({
  history: JSON.parse(TemporayStorageService.getString(key) || "[]"),
  setHistory: (history: INavigationItem[]) =>
    set(() => ({
      history,
    })),
}));

export const useNavigationStack = () => {
  const router = useRouter();

  const [history, setHistory] = useNavigationHistoryStore((store) => [
    store.history,
    store.setHistory,
  ]);

  const [pageTitle, viewKey, pageLink] = usePageDetailsStore((store) => [
    store.pageTitle,
    store.viewKey,
    store.pageLink,
  ]);

  useEffect(() => {
    TemporayStorageService.setString(key, JSON.stringify(history));
  }, [history]);

  const goBack = () => {
    const lastHistory = [...history].at(-2);

    router.replace(lastHistory.link);
  };

  const canGoBack = () => history.length > 1;

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
          link: pageLink,
          viewKey,
        };

        const newHistory = handleHistoryMutation(history, newStackEntry);

        setHistory(newHistory);
      },
      goToLinkIndex: (index: number) => {
        const lastHistory = [...history].at(index);

        router.replace(lastHistory.link);
      },
      goBack,
      canGoBack,
      backLink: canGoBack()
        ? {
            action: goBack,
            label: "Go Back",
          }
        : undefined,
    }),
    [typeof window, history, pageTitle, viewKey, pageLink]
  );
};
