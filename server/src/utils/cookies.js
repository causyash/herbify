const { env } = require("../config/env");

function accessCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
  };
}

module.exports = { accessCookieOptions };

