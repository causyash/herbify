const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const { env } = require("./config/env");
const { notFound, errorHandler } = require("./middleware/error");
const { authRouter } = require("./routes/auth");
const { categoriesRouter } = require("./routes/categories");
const { herbsRouter } = require("./routes/herbs");
const { productsRouter } = require("./routes/products");
const { cartRouter } = require("./routes/cart");
const { adminRouter } = require("./routes/admin");
const { uploadsRouter } = require("./routes/uploads");
const { ordersRouter } = require("./routes/orders");
const { paymentsRouter } = require("./routes/payments");
const { contactRouter } = require("./routes/contact");
const { reviewsRouter } = require("./routes/reviews");
const { usersRouter } = require("./routes/users");

function createApp({ dbConnected } = {}) {
  const app = express();
  app.set("trust proxy", 1);

  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(compression());

  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization", "Accept"]
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  });

  app.get("/api/health", (req, res) => {
    res.json({ ok: true, service: "herbify-api", dbConnected: !!dbConnected });
  });

  app.use("/api/auth", authLimiter, authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/categories", categoriesRouter);
  app.use("/api/herbs", herbsRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/uploads", uploadsRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/payments", paymentsRouter);
  app.use("/api/contact", authLimiter, contactRouter);
  app.use("/api/reviews", reviewsRouter);

  if (env.NODE_ENV === "production") {
    const distPath = path.join(__dirname, "../../client/dist");
    app.use(express.static(distPath));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api/")) return next();
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };

