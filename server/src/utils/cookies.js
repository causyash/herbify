const { env } = require("../config/env");

function accessCookieOptions() {
  const isProd =
    env.NODE_ENV === "production" ||
    (env.CLIENT_ORIGIN && env.CLIENT_ORIGIN.startsWith("https"));

  return {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    path: "/",
  };
}

module.exports = { accessCookieOptions };

