import { login } from "./modules/Login.js";
import { logout } from "./modules/Logout.js";
import { useApiFacebook } from "./modules/UseApiFacebook.js";
import { publishPhotos } from "./modules/PublishPhotos.js";
// get page id
async function page_id() {
  let userId = localStorage.getItem("userId");
  let access_token = localStorage.getItem("access_token");
  let action = "/accounts?";
  let method = "GET";
  let json = await useApiFacebook(userId, access_token, action, method);
  let pageID = await JSON.parse(json).data[0]; // this is a array whereby the users page is displayed
  return pageID;
}
async function ig_id() {
  let data = await page_id();
  let pageId = data.id;
  let pageToken = data.access_token;
  let action = "?fields=instagram_business_account";
  let method = "GET";
  let igID = await useApiFacebook(pageId, pageToken, action, method);
  return igID;
}
async function peticion_server(path) {
  let resp = await fetch(path);
  let response = await resp.text();
  console.log(response);
}

$("#btn-login").click(() => {
  login();
});

$("#btn-logout").click(() => {
  logout();
});

$("#btn-pages").click(async () => {
  let data = await page_id();
  console.log(data);
});

$("#btn-get-permissions").click(async () => {
  let userId = localStorage.getItem("userId");
  let access_token = localStorage.getItem("access_token");
  let action = "/permissions?";
  let method = "GET";
  let resp = await useApiFacebook(userId, access_token, action, method);
  console.table(resp);
});

///////////////////////// FACEBOOK     //////////////////
///////////////////////// POST SECTION ///////////////////////////////

// Facebook
$("#btn-publish-text-facebook").click(async () => {
  let data = await page_id();
  let pageId = data.id;
  let pageToken = data.access_token;
  let action = "/feed?message= Aqui va escrito un mensaje";
  let method = "POST";
  let resp = await useApiFacebook(pageId, pageToken, action, method);
  console.log(resp);
});

$("#btn-publish-photos-facebook").click(async () => {
  let data = await page_id();
  let pageId = data.id;
  let pageToken = data.access_token;
  let msg = "publish photo";
  publishPhotos(pageId, pageToken, msg);
});

$("#btn-publish-videos-facebook").click(() => {});

/////////////////////////// INSTAGRAM    ////////////////
/////////////////////////// LOGIN SECTION ///////////////
function template(data) {
  return `
    <div>
      <h1>${data.header}</h1>
      <p>${data.subheader}</p>
      <div id="progressBarOuter">
        <input id="username" placeholder="Usuario" ></input>
        <h>
        <input id="password" placeholder="Constraseña"></input>
      </div>
      <Button type="submit" >Entrar</Button>
    </div>
  `;
}

$("#btn-login-instagram").click(async () => {
  let newWindow = window.open(
    "",
    "Instagram",
    "height=670,width=512,left=512,location=yes,menubar=no,resizable=no,scrollbars=yes,status=no,titlebar=yes,top=0"
  );
  let temp = template({ header: "INSTAGRAM", subheader: "Inicio de sesion" });
  newWindow.document.write(temp);

  var url = "test";
  var data = { username: "example" };

  fetch("test", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  //peticion_server("login_instagram");
});

/////////////////////////// POST SECTION ////////////////
$("#btn-publish-ig-photo").click(async () => {
  peticion_server("upload_ig_photo");
});
