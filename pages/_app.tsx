/* eslint-disable react/prop-types */
import { AppWrapper } from "@adminator/chromista";

function MyApp({ Component, pageProps }) {
  return (
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  );
}

export default MyApp;
