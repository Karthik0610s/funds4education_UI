import axios from "axios";

const _ProductURL = "http://103.53.52.215:85/api";

const _baseURL = "https://localhost:44315/api";
//const _baseURL = "http://103.62.146.210:89/api";
//const _baseURL = "http://tptams.co.in:89/api";

//const _baseURL="https://prasath-001-site5.ntempurl.com/api";
// const _baseURL = "http://gkamaraj-001-site3.qtempurl.com/api" //"https://localhost:7158/api"//http://gkamaraj-001-site1.qtempurl.com/api"//"https://localhost:7158/api" ////"http://prasath-001-site3.ftempurl.com/api" //;
const _userURL = "http://manojvgl-001-site4.ctempurl.com/api/";

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
publicAxios.interceptors.request.use(async (config) => {
  const access_token = localStorage.getItem("token");
  const expiresAt = localStorage.getItem("expiresAt"); // Stored in ISO format

  if (access_token && expiresAt) {
    const expiryTime = new Date(expiresAt).getTime();
    const currentTime = new Date().getTime();

    // Token expired → remove token and redirect
    if (currentTime >= expiryTime) {
      console.log("Token expired, redirecting to login...");

         // CLEAR ALL AUTH LOCAL STORAGE
      localStorage.removeItem("token");
      localStorage.removeItem("expiresAt");
      localStorage.removeItem("user");
      localStorage.removeItem("roleId");
      localStorage.removeItem("roleName");
      localStorage.removeItem("username");
      localStorage.removeItem("name");
      localStorage.removeItem("id");
      localStorage.removeItem("userId");

      window.location.href = "/login";
      return Promise.reject("Token expired");
    }

    // Token valid → attach it
    if (config.headers.Authorization === undefined) {
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
