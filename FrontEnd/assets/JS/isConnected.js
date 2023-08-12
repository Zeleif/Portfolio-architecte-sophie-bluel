function isUserLoggedIn() {
    const token = localStorage.getItem("token");
    return !!token;
  }
 