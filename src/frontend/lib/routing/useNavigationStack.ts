import { createStore } from "@hadmean/protozoa";
import { ROOT_LINKS_TO_CLEAR_BREADCRUMBS } from "frontend/_layouts/app/constants";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { usePageDetailsStore } from "./usePageDetails";

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

export const useNavigationHistoryStore = createStore<IStore>((set) => ({
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
      goBack: () => {
        const lastHistory = [...history].at(-2);

        router.replace(lastHistory.link);
      },
      canGoBack: () => history.length > 1,
    }),
    [typeof window, history, pageTitle, viewKey, pageLink]
  );
};
