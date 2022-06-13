import { AppWrapper } from "@gothicgeeks/design-system";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  return (
    <AppWrapper>
      {/* TODO remove on next update */}
      <Toaster />
      <Component {...pageProps} />
    </AppWrapper>
  );
}

export default MyApp;
