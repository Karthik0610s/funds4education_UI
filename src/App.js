

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AppRoute from "./app/components/router/router";
import { store, persistor } from "./app/store"; // Import both store and persistor
import "./index.css"; // 👈 this loads Tailwind globally
import ChatWidget from "./app/components/chatwidget"

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="App">
         <ChatWidget />
          <AppRoute />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
