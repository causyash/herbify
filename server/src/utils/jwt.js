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

function signTrustedDeviceToken(userId) {
  if (!env.JWT_ACCESS_SECRET) {
    throw new Error("Missing JWT_ACCESS_SECRET");
  }
  return jwt.sign({ sub: userId, type: "trusted_device" }, env.JWT_ACCESS_SECRET, { expiresIn: '30d' });
}

function verifyTrustedDeviceToken(token) {
  if (!env.JWT_ACCESS_SECRET) return null;
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    if (payload.type === "trusted_device") return payload.sub;
    return null;
  } catch {
    return null;
  }
}

module.exports = { signAccessToken, verifyAccessToken, signTrustedDeviceToken, verifyTrustedDeviceToken };

