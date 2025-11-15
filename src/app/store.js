import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
// import { syncHistoryWithStore, routerReducer } from "react-router-redux";
import storage from "redux-persist/lib/storage";
import logger from "redux-logger";
//import {thunk} from "redux-thunk";
import scholarshipApplicationSlice from "./redux/slices/scholarshipApplicationSlice";
import authReducer from "./redux/slices/authSlice"
import InstitutionSignUpPage from "../pages/login/Institutionsignup";
import signupReducer from "./redux/slices/signupSlice"
import studentReducer from "./redux/slices/studentSlice";
import scholarshipReducer from "./redux/slices/ScholarshipSlice";
import sponsorScholarshipReducer from "./redux/slices/sponsorscholarshipSlice";
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only 'auth' slice will be persisted
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    scholarshipApplicationList: scholarshipApplicationSlice,
    auth: authReducer,
    scholarshipList: scholarshipReducer,
    //  InstitutionSignupList:InstitutionSignUpPage,
    signup: signupReducer,
    student: studentReducer,
    // scholarship:scholarshipReducer,
    scholarship: scholarshipReducer,
    sponsorScholarship: sponsorScholarshipReducer, 




  })
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({

      serializableCheck: false, // Ignore check for non-serializable values
    }).concat(logger), // Add logger middleware
});

const persistor = persistStore(store);
if (typeof window !== "undefined") {
  window.persistor = persistor;
}

export { store, persistor };
