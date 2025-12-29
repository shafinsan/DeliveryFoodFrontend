export const TokenValidator = () => {
  const MyToken = localStorage.getItem("Token")
    ? JSON.parse(localStorage.getItem("Token")).token
    : null;
  const Time = localStorage.getItem("Token")
    ? JSON.parse(localStorage.getItem("Token")).exp
    : null;
  if (MyToken === null || Time === null) return;
  if (Time >= Date.now()) {
    return;
  } else {
    localStorage.removeItem("Token");
    localStorage.removeItem("Role");
    localStorage.removeItem("Id");
    localStorage.removeItem("Email");
    localStorage.removeItem("profile");
    setTimeout(() => {
      window.location.reload()
    }, 500);
    return;
  }
};
