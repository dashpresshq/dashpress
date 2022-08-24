/* eslint-disable react/prop-types */
import { AppWrapper } from "@hadmean/chromista";
import "../static/fonts/font-face.css";

function MyApp({ Component, pageProps }) {
  return (
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  );
}

export default MyApp;
