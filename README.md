# Ejecución de ejemplo.

    clona el repositorio  luego ejecuta`npm install` y por ultimo `npm run deploy`

# Guía de utilización de Api de facebook utilizando node js

pasos:

## 1.Configuración de facebook developers.

Primero comenzaremos con la creación de una cuenta en facebook developer. Una vez realizado esto crearás una nueva app.

![sample1](https://raw.githubusercontent.com/emajidev/guide-api-facebook-nodejs/master/sample1.png)

Luego nos dirigimos a configuración básica, en esta opción encontraremos id de la app, Nombre para mostrar, Correo electrónico de contacto, entre otros.
observaremos en la casilla de "URL de la Política de privacidad" la cual nos permitirá establecer la conexión con nuestro servidor, siendo para este caso una comunicación por localhost.

![sample2](https://raw.githubusercontent.com/emajidev/guide-api-facebook-nodejs/master/sample2.png)

No obstante nuestra conexión con la api de facebook dará error si la utilizamos. Esto se debe a que nuestro servidor necesita poseer un certificado SSL para la protección en la transferencia de datos. Solucionaremos este problema creando los certificados muy fácilmente con Open SSL para ello ejecutamos lo siguiente:

`mkdir SSLcertication`

`cd SSLcertication`

`openssl req -new -newkey rsa:2048 -nodes -keyout server.key -out localhost.csr`

Luego la configuración de nuestro servidor node con mediante express sera la siguiente:
```js
  var fs = require("fs");
  var https = require("https");                                  
  var express = require("express");
  const app = express();  
  app.use(express.static(__dirname + "/public/"));
                                    
  https                                                  
    .createServer(
      {
        cert: fs.readFileSync("./SSLcertication/localhost.crt"),
        key: fs.readFileSync("./SSLcertication/localhost.key"),
      },                                                     
      app
    )
    .listen("3000", function () {
      console.log("Server running in 3000 port");
    });
```

Ya realizado esto no tendremos problemas con las llamadas que se realicen a la api de facebook.

## 2. Implementación SDK  

lo primero que se debe hacer es copiar el CDN sdk de facebook dentro de nuestro index.html

```js
<script async defer src="https://connect.facebook.net/en_US/sdk.js"></script>
```

Para utilizar la api la llamaremos de la siguiente manera desde nuestro main.js:
```js
  window.fbAsyncInit = async function () {
    try {
      FB.init({
        appId: {App-id},
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
```
## 3. Login de usuario y obtención de token de larga duracion
Para iniciar sesión nuestro usuario lo realizaremos de la siguiente manera, con ellos obtendremos diversos datos dentro de un objecto tales como id de usuario, token, nombre de cuenta, correo electrónico entre otros, estos permisos son solicitados mediante el scope. Ademas Es importante resaltar que podemos almacenar nuestro userID y access_token dentro de localStorage para posteriormente ser utilizados.

```js
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
            console.log("long token", respLongAccessToken);

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
    });
```

### ESCRIBIR-Publicar comentario en página de facebook
Podemos publicar en una página utilizando fetch por medio del método POST
```js 
  let access_token = localStorage.getItem("access_token");
  let userId = localStorage.getItem("userId");
  let response = await fetch(
    "https://graph.facebook.com/" +
      userId +
      "/accounts?access_token=" +
      access_token
  );
  let json = await response.text(); // read response body as text
  let data = JSON.parse(json).data[0];// select array position
  let path = "/" + data.id + "/feed";
  let method = "POST";
  let data_publish = {
    message: "hola a todos",
    access_token: data.access_token,
  };

  let post = await fetch(
    "https://graph.facebook.com/" +
      data.id +
      "/feed?message=Hello Fans! &access_token=" +
      data.access_token,
    {
      method: "POST",
    }
  );
  let resp = await post.text();

```
### ESCRIBIR-Publicar fotos en página de facebook
Podemos publicar fotos en una página utilizando un objecto Blob y enviado por el metodo fetch por medio del método POST

```js
pageAccessToken, msg) {
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

```








