var appId = "819263155488647";
var appSecret = "4638b101026186ab5697fe47e3f45103";
window.fbAsyncInit = async function () {
  try {
    FB.init({
      appId: appId,
      cookie: true,
      xfbml: true,
      version: "v8.0",
    });
    await FB.AppEvents.logPageView();
    console.log("llamando sdk facebook");
  } catch (e) {
    console.log(e);
  }
};
export function login() {
  FB.login(
    function (response) {
      // handle the response
      if (response.authResponse) {
        FB.api("/me", function (response) {});
        FB.getLoginStatus(async (response) => {
          if (response.status === "connected") {
            $("#status").html("Online!");
            let accessToken = response.authResponse.accessToken;
            let userId = response.authResponse.userID;

            let longAccessToken = await fetch(
              `https://graph.facebook.com/v8.0/oauth/access_token?grant_type=fb_exchange_token& client_id=${appId}& client_secret=${appSecret}&fb_exchange_token=${accessToken}`
            );

            let respLongAccessToken = await response.authResponse.accessToken;
            console.log("token larga duracion", respLongAccessToken);

            localStorage.setItem("userId", userId);
            localStorage.setItem("access_token", respLongAccessToken);
          }
        });
      } else {
        console.log("User cancelled login or did not fully authorize.");
      }
    },
    {
      scope: "pages_show_list,pages_manage_posts,pages_read_engagement",
      return_scopes: true,
    }
  );
}
