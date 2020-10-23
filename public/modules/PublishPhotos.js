export async function publishPhotos(pageId, pageAccessToken, msg) {
  let url = "../images/logo.png";
  let resp = await fetch(url);
  let photoData = await resp.blob(); //return blob object

  const formData = new FormData(); // build a new format to send in body of fetch

  formData.append("access_token", pageAccessToken);
  formData.append("source", photoData);
  formData.append("message", msg);

  let response = await fetch(`https://graph.facebook.com/${pageId}/photos`, {
    body: formData,
    method: "post",
  });

  response = await response.json();

  console.log(response);
}
