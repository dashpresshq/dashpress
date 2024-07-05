import type { ReactElement } from "react";
import { IsSignedIn } from "./IsSignedIn";
import { NavigationSideBar } from "./NavigationSideBar";

export const getAppLayout = (page: ReactElement) => {
  return (
    <IsSignedIn>
      <NavigationSideBar>{page}</NavigationSideBar>
    </IsSignedIn>
  );
};
