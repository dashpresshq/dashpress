/* eslint-disable react/prop-types */
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import "../static/fonts/font-face.css";

function MyApp({ Component, pageProps }) {
  return (
    <ApplicationRoot messages={pageProps.messages}>
      <Component {...pageProps} />
    </ApplicationRoot>
  );
}

export default MyApp;
