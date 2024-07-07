import "@/styles/globals.css";
import "../static/fonts/font-face.css";

import type { AppProps } from "next/app";
import type { ReactElement } from "react";

import { ApplicationRoot } from "@/components/app/roots";
import { getAppLayout } from "@/frontend/_layouts/app/getLayout";
import type { CustomNextPage } from "@/frontend/_layouts/types";

function MyApp({
  Component,
  pageProps,
}: AppProps & {
  Component: CustomNextPage;
}) {
  const getLayout =
    Component.useAppLayout === false
      ? (page: ReactElement) => page
      : getAppLayout;

  return (
    <ApplicationRoot translation={pageProps.translation}>
      {getLayout(<Component {...pageProps} />)}
    </ApplicationRoot>
  );
}

export default MyApp;
