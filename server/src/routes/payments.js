const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const { z } = require("zod");

const { requireAuth } = require("../middleware/auth");
const { env } = require("../config/env");
const { Order } = require("../models/Order");
const { User } = require("../models/User");
const { Product } = require("../models/Product");
const { Herb } = require("../models/Herb");
const { sendAdminSMS } = require("../utils/smsService");

const router = express.Router();

function razorpayClient() {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    throw Object.assign(new Error("Razorpay is not configured"), { statusCode: 500 });
  }
  return new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET });
}

router.post("/razorpay/create-order", requireAuth, async (req, res) => {
  const parsed = z.object({ orderId: z.string().min(1) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const order = await Order.findById(parsed.data.orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (String(order.userId) !== String(req.user._id))
    return res.status(403).json({ message: "Forbidden" });
  if (order.paymentStatus !== "created")
    return res.status(400).json({ message: "Order is not payable" });

  const amountPaise = Math.round(order.total * 100);
  const rp = razorpayClient();
  const rpOrder = await rp.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: String(order._id),
  });

  order.razorpayOrderId = rpOrder.id;
  await order.save();

  res.json({
    keyId: env.RAZORPAY_KEY_ID,
    razorpayOrderId: rpOrder.id,
    amount: rpOrder.amount,
    currency: rpOrder.currency,
    orderId: String(order._id),
  });
});

router.post("/razorpay/verify", requireAuth, async (req, res) => {
  const parsed = z
    .object({
      orderId: z.string().min(1),
      razorpay_order_id: z.string().min(1),
      razorpay_payment_id: z.string().min(1),
      razorpay_signature: z.string().min(1),
    })
    .safeParse(req.body);

  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const order = await Order.findById(parsed.data.orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (String(order.userId) !== String(req.user._id))
    return res.status(403).json({ message: "Forbidden" });

  if (order.razorpayOrderId && order.razorpayOrderId !== parsed.data.razorpay_order_id) {
    return res.status(400).json({ message: "Order mismatch" });
  }

  if (!env.RAZORPAY_KEY_SECRET) return res.status(500).json({ message: "Razorpay not configured" });

  const body = `${parsed.data.razorpay_order_id}|${parsed.data.razorpay_payment_id}`;
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expected !== parsed.data.razorpay_signature) {
    order.paymentStatus = "failed";
    await order.save();
    return res.status(400).json({ message: "Signature verification failed" });
  }

  order.paymentStatus = "paid";
  order.orderStatus = "processing";
  order.razorpayOrderId = parsed.data.razorpay_order_id;
  order.razorpayPaymentId = parsed.data.razorpay_payment_id;
  order.razorpaySignature = parsed.data.razorpay_signature;
  await order.save();

  // Notify Admin via Socket.io
  const io = req.app.get("io");
  if (io) {
    io.to("admin-room").emit("new-order", {
      id: order._id,
      customer: req.user.name,
      total: order.total,
      time: order.createdAt,
    });
  }

  // Inventory Management & Notification
  let orderDetailsHtml = `🛍️ <b>New Order Placed!</b>\n\n`;
  orderDetailsHtml += `<b>Order ID:</b> #${String(order._id).slice(-6).toUpperCase()}\n`;
  orderDetailsHtml += `<b>Customer:</b> ${req.user.name}\n`;
  orderDetailsHtml += `<b>Total:</b> Rs.${order.total}\n\n`;
  orderDetailsHtml += `<b>Items Ordered & New Stock:</b>\n`;

  try {
    const stockUpdates = order.items.map(async (item) => {
      const Model = item.itemType === "herb" ? Herb : Product;
      const updatedItem = await Model.findByIdAndUpdate(
        item.itemId,
        { $inc: { stock: -item.qty } },
        { new: true } // Return the updated document
      );

      // Emit live stock update to all clients
      if (io && updatedItem) {
        io.emit("stock-update", {
          itemId: item.itemId,
          itemType: item.itemType,
          newStock: updatedItem.stock,
        });
      }

      const remainingStockStr = updatedItem ? updatedItem.stock : 'Unknown';
      orderDetailsHtml += `- ${item.name} (Qty: ${item.qty}) -> Stock left: <b>${remainingStockStr}</b>\n`;

      // Check for low stock and notify Admin via Telegram
      if (updatedItem && updatedItem.stock <= 5) {
        sendAdminSMS(
          `⚠️ <b>LOW STOCK ALERT:</b> Only ${updatedItem.stock} left for <b>${updatedItem.name}</b>! Please review inventory.`
        ).catch(err => console.error("Telegram low stock alert error:", err));
      }

      return updatedItem;
    });
    await Promise.all(stockUpdates);

    // Send the comprehensive SMS Alert to Admin
    sendAdminSMS(orderDetailsHtml).catch(err => console.error("SMS background error:", err));

  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to update inventory for order:", order._id, err);
    // Send fallback SMS
    sendAdminSMS(
      `Herbify: New order received! Order #${String(order._id).slice(-6).toUpperCase()} by ${req.user.name} for Rs.${order.total}. Check Admin Console.`
    ).catch(err2 => console.error("SMS background error:", err2));
  }

  await User.findByIdAndUpdate(req.user._id, { $set: { cartItems: [] } });

  res.json({ ok: true, orderId: String(order._id) });
});

module.exports = { paymentsRouter: router };

