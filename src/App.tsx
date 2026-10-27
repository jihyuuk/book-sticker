import AppToaster from "./app-toaster";
import ModalProvider from "./provider/modal-provider";
import SessionProvider from "./provider/session-provider";
import RootRoute from "./root-route";

function App() {
  return (
    <SessionProvider>
      <ModalProvider>
        <AppToaster />
        <RootRoute />
      </ModalProvider>
    </SessionProvider>
  );
}

export default App;
