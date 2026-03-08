const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

function signAccessToken(payload) {
  if (!env.JWT_ACCESS_SECRET) {
    throw new Error("Missing JWT_ACCESS_SECRET");
  }
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
}

function verifyAccessToken(token) {
  if (!env.JWT_ACCESS_SECRET) {
    throw new Error("Missing JWT_ACCESS_SECRET");
  }
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

module.exports = { signAccessToken, verifyAccessToken };

