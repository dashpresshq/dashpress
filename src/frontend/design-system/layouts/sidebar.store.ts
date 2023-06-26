import { createStore } from "@hadmean/protozoa";

type IStore = {
  currentMiniSideBar?: string;
  currentTitle: string;
  isFullSideBarOpen: boolean;
  closeFullSideBar: () => void;
  selectMiniSideBar: (selection: string) => void;
  setCurrentTitle: (title: string) => void;
};

export const useSideBarStore = createStore<IStore>((set) => ({
  currentMiniSideBar: undefined,
  isFullSideBarOpen: false,
  currentTitle: "",
  setCurrentTitle: (currentTitle) =>
    set(() => ({
      currentTitle,
    })),
  closeFullSideBar: () =>
    set(() => ({
      currentMiniSideBar: undefined,
      isFullSideBarOpen: false,
    })),
  selectMiniSideBar: (selection: string) =>
    set(({ currentMiniSideBar, isFullSideBarOpen }) => ({
      currentMiniSideBar: selection,
      isFullSideBarOpen:
        currentMiniSideBar === selection ? !isFullSideBarOpen : true,
    })),
}));
