import { createStore } from "frontend/lib/store";
import { IGroupActionButton } from "frontend/design-system/components/Button/types";
import { DOCUMENTATION_LABEL } from ".";

type IDocumentationCanvasStore = {
  title: string;
  setTitle: (title: string) => void;
};

export const useDocumentationCanvasStore =
  createStore<IDocumentationCanvasStore>((set) => ({
    title: "",
    setTitle: (title) =>
      set(() => ({
        title,
      })),
  }));

export const useDocumentationActionButton = (
  title: string
): IGroupActionButton => {
  const canvasStore = useDocumentationCanvasStore();

  return {
    id: "help",
    action: () => canvasStore.setTitle(title),
    systemIcon: "Help",
    label: DOCUMENTATION_LABEL.CONCEPT(title),
  };
};
