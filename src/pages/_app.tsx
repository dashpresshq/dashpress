/* eslint-disable react/prop-types */
import "@/styles/globals.css";
import "../static/fonts/font-face.css";
import { ReactElement } from "react";
import { AppProps } from "next/app";
import { getAppLayout } from "frontend/_layouts/app/getLayout";
import { CustomNextPage } from "frontend/_layouts/types";
import { ApplicationRoot } from "@/components/app/roots";

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
