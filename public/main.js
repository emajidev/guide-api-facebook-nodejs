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

///////////////////////// POST SECTION ///////////////////////////////
// get user permissions
$("#btn-get-permissions").click(async () => {
  let userId = localStorage.getItem("userId");
  let access_token = localStorage.getItem("access_token");
  let action = "/permissions?";
  let method = "GET";
  let resp = await useApiFacebook(userId, access_token, action, method);
  console.table(resp);
});

//Get the Instagram Business Account's Media
$("#btn-get-data-instagram").click(async () => {
  let dataPage = await page_id();
  let igID = await ig_id();
  let pageToken = dataPage.access_token;
  let action = "/media?";
  let method = "GET";
  let resp = await useApiFacebook(igID, pageToken, action, method);
  console.table(resp);
});

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

//Instagram
$("#btn-publish-comment-instagram").click(async () => {
  let dataPage = await page_id();
  let igID = await ig_id();
  let pageToken = dataPage.access_token;
  let action = "/feed?message= Aqui va escrito un mensaje";
  let method = "POST";
  let resp = await useApiFacebook(pageId, pageToken, action, method);
  console.log(resp);
});
