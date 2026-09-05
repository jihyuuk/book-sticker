import ModalProvider from "./provider/modal-provider";
import SessionProvider from "./provider/session-provider";
import RootRoute from "./root-route";
import { Toaster } from "sonner";

function App() {
  return (
    <SessionProvider>
      <ModalProvider>
        <Toaster richColors position="top-center" duration={2000} />
        <RootRoute />
      </ModalProvider>
    </SessionProvider>
  );
}

export default App;
