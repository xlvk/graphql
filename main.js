/**
 * Updated the event listener for the 'popstate' event to use the ForumRouter 
 * function from the './funcs/router' module. This ensures that when the browser's 
 * history state changes (e.g., user navigates back or forward), the ForumRouter f
 * unction is executed to handle the routing logic.
 * 
 *! Added a 'beforeunload' event listener that removes the 'chat_user_selected' 
 *! item from the sessionStorage. This ensures that when the user leaves the page
 *! or refreshes it, the previously selected chat user data is cleared from the session storage.
 *
 * Implemented a 'DOMContentLoaded' event listener that asynchronously calls the ForumRouter function. 
 * This ensures that the routing logic is executed once the initial HTML document has been completely 
 * loaded and parsed, allowing the application to handle the initial routing state correctly.
 * 
 */
import './css/index.css';
import './css/profile.css';
import './css/sign.css';
import './root.css';
import { ForumRouter } from "./funcs/router";

window.addEventListener("popstate", ForumRouter);
window.onbeforeunload = sessionStorage.removeItem("chat_user_selected");

document.addEventListener("DOMContentLoaded", async () => {
  ForumRouter();
});
