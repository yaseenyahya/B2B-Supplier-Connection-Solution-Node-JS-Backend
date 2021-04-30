import expressConfig from "../config/express.json";

export const Facebook =  {
  fbInt() {
    const env = process.env.NODE_ENV || "development";
    const config = expressConfig[env];

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: config.facebook_app_id,
        cookie: true, // enable cookies to allow the server to access
        // the session
        xfbml: true, // parse social plugins on this page
        version: "v2.1", // use version 2.1
      });
     
   
    };
    
    // Load the SDK asynchronously
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  },
  
}

