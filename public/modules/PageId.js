export async function page_id() {
  let userId = localStorage.getItem("userId");
  let access_token = localStorage.getItem("access_token");
  let action = "/accounts?";
  let method = "GET";
  let json = await useApiFacebook(userId, access_token, action, method);
  let data = await JSON.parse(json).data[0];
  return data;
}
