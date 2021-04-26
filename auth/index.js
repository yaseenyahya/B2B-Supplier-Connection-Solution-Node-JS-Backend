var { sign } = require("jsonwebtoken");
var secrets = require("../config/secrets.json");
class Auth {
  createTokensInCookies(userID, response) {
    const refreshToken = sign(
      { userID: userID },
      secrets.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );
    const accessToken = sign({ userID: userID }, secrets.ACCESS_TOKEN_SECRET, {
      expiresIn: "15min",
    });
    const current = new Date();
    const minutes15 = new Date();
    minutes15.setMinutes(current.getMinutes() + 15);
    const week1 = new Date();
    week1.setHours(current.getHours() + 24 * 7);

    response.cookie("refresh-token", refreshToken, { expires: week1 });
    response.cookie("access-token", accessToken, { expires: minutes15 });

    console.log("auth", refreshToken);
    return { refreshToken, accessToken };
  }
  removeTokensInCookies(response) {
    response.clearCookie("refresh-token");
    response.clearCookie("access-token");
  }
}

module.exports = Auth;
