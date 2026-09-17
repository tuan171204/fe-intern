import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { AppRoutes } from "@/routes/AppRoutes";
import { Toaster } from "@/components/ui/toaster";
import "@/i18n/config";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster />
      </BrowserRouter>
    </Provider>
  );
}