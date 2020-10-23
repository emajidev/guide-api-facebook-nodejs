export async function useApiFacebook(id, token, action, method) {
  let request = await fetch(
    `https://graph.facebook.com/${id}${action}access_token=${token}`,
    {
      method: method,
    }
  );

  let resp = await request.text();
  return resp;
}
