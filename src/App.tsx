import ModalProvider from "./provider/modal-provider";
import RootRoute from "./root-route";

function App() {
  return (
    <ModalProvider>
      <RootRoute />
    </ModalProvider>
  );
}

export default App;
