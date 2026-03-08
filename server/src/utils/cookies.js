const { env } = require("../config/env");

function accessCookieOptions() {
  return {
    httpOnly: true,
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
  };
}

module.exports = { accessCookieOptions };

