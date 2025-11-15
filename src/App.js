

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AppRoute from "./app/components/router/router";
import { store, persistor } from "./app/store"; // Import both store and persistor
import "./index.css"; // 👈 this loads Tailwind globally


function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="App">
         
          <AppRoute />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
