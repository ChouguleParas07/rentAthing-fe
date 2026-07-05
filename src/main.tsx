import { Toaster } from "sonner";

import App from "./App";
import QueryProvider from "./providers/QueryProvider";
import { store } from "./store/store";

import "./index.css";

import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <QueryProvider>
      <App />
      <Toaster richColors position="top-right" />
    </QueryProvider>
  </Provider>,
);
