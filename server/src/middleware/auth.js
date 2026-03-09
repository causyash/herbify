const { verifyAccessToken } = require("../utils/jwt");
const { User } = require("../models/User");

async function requireAuth(req, res, next) {
  try {
    let token = null
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token && req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    }
    
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.sub).select("-passwordHash");
    if (!user) return res.status(401).json({ message: "Not authenticated" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authenticated" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });
  next();
}

module.exports = { requireAuth, requireAdmin };

