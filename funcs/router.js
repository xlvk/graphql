import { Home } from "../pages/Home";
import { Login } from "../pages/auth/login";
import { Profile } from "../pages/profile";
import { Logout } from "./logout";
import { UpdateCSS } from "./funcs";
import { TimeLine } from "../pages/timeline";
// import { Graph } from "../pages/graphiql.jsx";

const routes = {
  "/profile": { component: Profile, stylesheet: "/css/profile.css" },
  "/login": { component: Login, stylesheet: "/css/sign.css" },
  "/timeline": { component: TimeLine, stylesheet: "/css/timeline.css" },
  // "/graphiql": { component: Graph, stylesheet: "/css/index.css" },
  "/": { component: Home, stylesheet: "/css/index.css" },
};

const ExtractHref = () => {
  let url = location.href;
  const urlParts = url.split("/");
  console.log(urlParts, urlParts[urlParts.length - 2]);
  if (urlParts.length > 4) {
    var pathname = urlParts[urlParts.length - 2];
  } else {
    var pathname = urlParts[urlParts.length - 1];
  }
  console.log(pathname);
  return pathname;
};

/**
 * frontend router
 */
export const ForumRouter = () => {
  const path = ExtractHref();
  const route = routes["/" + path];
  if (path === "logout") {
    Logout();
    return;
  }
  if (route) {
    route.component();
    UpdateCSS(route.stylesheet);
  } else {
    Home(); // Default route
    UpdateCSS("/css/index.css"); // Default stylesheet
  }
};
