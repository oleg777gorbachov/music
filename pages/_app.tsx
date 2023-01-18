import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { wrapper } from "../redux";
import { Provider } from "react-redux";
import AuthProvider from "../components/AuthProvider";

function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;


  return (
    <Provider store={store}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </Provider>
  );
}

export default App;
