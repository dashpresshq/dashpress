/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { AppWrapper } from "@gothicgeeks/design-system";

function MyApp({ Component, pageProps }) {
  return (
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  );
}

export default MyApp;
