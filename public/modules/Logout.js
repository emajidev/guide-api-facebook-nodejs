export function logout() {
  FB.getLoginStatus(async (response) => {
    if (response.status === "connected") {
      FB.api("/me/permissions", "DELETE", {}, function (response) {
        console.log(response);
        FB.logout(function (response) {
          // Person is now logged out
          console.log(response);
          localStorage.setItem("userId", "");
          localStorage.setItem("access_token", "");
        });
      });
      console.log(response);
    } else {
    }
  });
}
