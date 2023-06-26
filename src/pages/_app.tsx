/* eslint-disable react/prop-types */
import { ApplicationRoot } from "frontend/components/ApplicationRoot";

function MyApp({ Component, pageProps }) {
  return (
    <ApplicationRoot>
      <Component {...pageProps} />
    </ApplicationRoot>
  );
}

export default MyApp;
