window.fbAsyncInit = async function () {
  try {
    FB.init({
      appId: "819263155488647",
      autoLogAppEvents: true,
      xfbml: true,
      version: "v8.0",
    });
    await FB.AppEvents.logPageView();
    console.log("llamando sdk facebook");
  } catch (e) {
    console.log(e);
  }
};

$("#btn-login").click(function () {
  FB.login(function (response) {
    if (response.authResponse) {
      console.log("Bienvenido.... ");
      FB.api("/me", function (response) {
        console.log("un gusto, " + response.name + ".");
        console.table(response);
      });

      FB.getLoginStatus(function (response) {
        if (response.status === "connected") {
          let accessToken = response.authResponse.accessToken;
          let userId = response.authResponse.userID;
          console.log(userId);
          console.log(accessToken);
          localStorage.setItem("userId", userId);
          localStorage.setItem("access_token", accessToken);
        }
      });
    } else {
      console.log("User cancelled login or did not fully authorize.");
    }
  });
});

$("#btn-publish").click(async function () {
  let access_token = localStorage.getItem("access_token");
  let userId = localStorage.getItem("userId");
  let response = await fetch(
    "https://graph.facebook.com/" +
      userId +
      "/accounts?access_token=" +
      access_token
  );

  let json = await response.text(); // read response body as text

  let data = JSON.parse(json).data[0];
  console.table(JSON.parse(json).data);
  let path = "/" + data.id + "/feed";
  console.log("id_page", data.id, data.access_token);
  let method = "POST";
  let data_publish = {
    message: "hola a todos",
    access_token: data.access_token,
  };

  let post = await fetch(
    "https://graph.facebook.com/" +
      data.id +
      "/feed?message=Hello Fans!&access_token=" +
      data.access_token
  );
  let resp = await post.text();
  console.log(resp);
});
