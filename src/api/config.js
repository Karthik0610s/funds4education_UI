import axios from "axios";
import { ApiKey } from "./endpoint";
const _ProductURL = "http://103.53.52.215:85/api";

const _baseURL = "https://localhost:44315/api/v1";
//const _baseURL = "http://103.62.146.210:89/api";
//const _baseURL = "http://tptams.co.in:89/api";
// const _baseURL = "https://funds4education.in/api/v1";

//const _baseURL="https://prasath-001-site5.ntempurl.com/api";
// const _baseURL = "http://gkamaraj-001-site3.qtempurl.com/api" //"https://localhost:7158/api"//http://gkamaraj-001-site1.qtempurl.com/api"//"https://localhost:7158/api" ////"http://prasath-001-site3.ftempurl.com/api" //;
const _userURL = "http://manojvgl-001-site4.ctempurl.com/api/";
let isSessionClosing = false; // ✅ PREVENT MULTIPLE CALLS
export const authAxios = axios.create({
  // timeout: 60000,
  baseURL: _baseURL,
});

export const publicAxios = axios.create({
  // timeout: 60000,
  baseURL: _baseURL,
});

/*publicAxios.interceptors.request.use(async (config) => {
  const access_token = localStorage.getItem("token");
  if (access_token != null && config.headers.Authorization === undefined) {
    config.headers.Authorization = `bearer ${access_token}`;
  }
  return config;
});*/
// ✅ Auto-logout timer: runs on page load
// ✅ Continuous token expiry check
const closeChatSession = async () => {
   debugger;
  if (isSessionClosing) return;
  isSessionClosing = true;

  try {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    await publicAxios.post(
  `${ApiKey.GetSessionClosed}?sessionId=${userId}`
);

    console.log("Chat session closed successfully");
  } catch (error) {
    console.error("Failed to close chat session:", error);
  }
};

(function setupContinuousLogout() {
  const checkExpiry = async () => {
   
    const expiresAt = localStorage.getItem("expiresAt");
    const token = localStorage.getItem("token");

    if (token && expiresAt) {
      const expiryTime = new Date(expiresAt).getTime();
      const currentTime = Date.now();

      if (currentTime >= expiryTime) {
        console.log("Token expired, logging out automatically...");
            await closeChatSession();
        localStorage.clear();
        window.location.href = "/login";
      }
    }
  };

  // Check immediately and then every second
  checkExpiry();
  setInterval(checkExpiry, 1000); // every 1 second
})();

// ✅ Public Axios interceptor: attach token and check expiry on each request
publicAxios.interceptors.request.use(async(config) => {
  const access_token = localStorage.getItem("token");
  const expiresAt = localStorage.getItem("expiresAt"); // ISO string

  if (access_token && expiresAt) {
    const expiryTime = new Date(expiresAt).getTime();
    const currentTime = Date.now();

    // Token expired → logout immediately
    /*if (currentTime >= expiryTime) {
      console.log("Token expired (request), redirecting to login...");
         // ✅ CLOSE CHAT SESSION
      await closeChatSession();
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject("Token expired");
    }*/

    // Token valid → attach
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
  }

  return config;
});


authAxios.interceptors.request.use(async (config) => {
  config.headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  return config;
});
