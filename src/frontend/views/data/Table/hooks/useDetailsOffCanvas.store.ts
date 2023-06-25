import { createStore } from "frontend/lib/store";

type IStore = {
  entity: string;
  id: string;
  open: (value: { entity: string; id: string }) => void;
  close: () => void;
};

export const useDetailsOffCanvasStore = createStore<IStore>((set) => ({
  entity: "",
  id: "",
  open: ({ entity, id }) =>
    set(() => ({
      entity,
      id,
    })),
  close: () => {
    set(() => ({
      entity: "",
      id: "",
    }));
  },
}));
