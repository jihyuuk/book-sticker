import ModalProvider from "./provider/modal-provider";
import RootRoute from "./root-route";
import { Toaster } from "sonner";

function App() {
  return (
    <ModalProvider>
      <Toaster richColors position="top-center" duration={2000} />
      <RootRoute />
    </ModalProvider>
  );
}

export default App;
