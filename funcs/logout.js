/**
 * Function that expires all jwt tokens,
 * logs out, and redirects
 * to `/login`
 */
export const Logout = async () => {
  localStorage.removeItem("VAriableName");
  localStorage.removeItem("jwt")
  window.location.assign("/login");
};
