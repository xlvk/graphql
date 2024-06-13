import { BACKENDURL } from "./vars";
// import noheart from "../assets/unliked.svg";
// import comment from "../assets/comment.svg";
// import heart from "../assets/liked.svg";
/**
 *
 * Follow up login after signup
 *
 * @param {string} email
 * @param {string} pass
 */
export const Flogin = async (email, pass) => {
  if (!email || !pass) {
    return;
  }

  const res = await fetch(BACKENDURL + "/auth/login", {
    method: "POST",
    body: JSON.stringify({
      credential: email,
      password: pass,
    }),
    credentials: "include",
  });

  if (res.ok) {
    SetSessionStorage(await res.json());
    window.location.assign("/");
  }
};

/**
 * Function to Update CSS en routing
 * @param {Stylesheet} stylesheet - Path to css file
 */
export const UpdateCSS = (stylesheet) => {
  const linkElement = document.getElementById("page-styles");
  if (linkElement) {
    linkElement.href = stylesheet;
    const styleTags = document.querySelectorAll("style");
    styleTags.forEach((tag) => tag.remove());
  } else {
    console.error("Page stylesheet link not found");
  }
};

