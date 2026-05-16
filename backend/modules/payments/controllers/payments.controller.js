const Razorpay = require("razorpay");
const crypto = require("crypto");
const pool = require("../../../config/db");
const {
  successResponse,
  errorResponse,
} = require("../../../shared/response.utils");
const { CartQueries } = require("../../cart/queries/cart.queries");
const OrderQueries = require("../../orders/queries/orders.queries");

// Create Razorpay order (server-side) — returns order and key id for client checkout
const createOrder = async (req, res) => {
  try {
    // Validate Razorpay keys
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay keys missing in environment");
      return errorResponse(res, "Payment provider not configured", 500);
    }
    const { shipping = 0, tax = 0 } = req.body;
    const userId = req.user.id;
    const cartItems = await CartQueries.getCartByUserId(userId);

    if (!cartItems || cartItems.length === 0) {
      return errorResponse(res, "Cart is empty", 400);
    }

    const itemsSubtotal = cartItems.reduce(
      (total, item) => total + Number(item.price) * Number(item.quantity),
      0,
    );
    
    const totalAmount = itemsSubtotal + Number(shipping) + Number(tax);
    
    console.log(
      `Creating Razorpay order for user=${userId} items=${cartItems.length} subtotal=${itemsSubtotal} shipping=${shipping} tax=${tax} total=${totalAmount}`,
    );
    const amountInPaise = Math.round(totalAmount * 100);

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${userId}_${Date.now()}`,
      payment_capture: 1,
      notes: {
        shipping: shipping.toString(),
        tax: tax.toString(),
        subtotal: itemsSubtotal.toString()
      }
    };

    const order = await razorpay.orders.create(options);

    return successResponse(res, { order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error(
      "Razorpay createOrder error:",
      err && err.stack ? err.stack : err,
    );
    return errorResponse(res, err.message || "Failed to create order");
  }
};

// Verify payment signature sent by client after checkout and create actual order record
const verifyPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return errorResponse(res, "Invalid payment payload", 400);
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.warn("Signature verification mismatch", {
        expected: expectedSignature,
        received: razorpay_signature,
      });
      return errorResponse(res, "Signature verification failed", 400);
    }

    // 1) Fetch Razorpay order details to get notes (shipping, tax)
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const rzpOrder = await razorpay.orders.fetch(razorpay_order_id);
    const shipping = Number(rzpOrder.notes?.shipping || 0);
    const tax = Number(rzpOrder.notes?.tax || 0);

    // signature valid -> create order in DB from cart
    const cartItems = await CartQueries.getCartByUserId(userId);
    if (!cartItems || cartItems.length === 0) {
      return errorResponse(res, "Cart is empty", 400);
    }

    const itemsSubtotal = cartItems.reduce(
      (total, item) => total + Number(item.price) * Number(item.quantity),
      0,
    );
    const totalAmount = itemsSubtotal + shipping + tax;

    const orderId = await OrderQueries.createOrder(
      userId,
      totalAmount,
      cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
      shipping,
      tax
    );

    // mark order completed
    await pool.execute("UPDATE orders SET status = ? WHERE id = ?", [
      "completed",
      orderId,
    ]);

    // record payment details in order_history
    await pool.execute(
      "INSERT INTO order_history (user_id, order_id, action, details) VALUES (?, ?, ?, ?)",
      [
        userId,
        orderId,
        "payment",
        `razorpay_payment_id:${razorpay_payment_id}`,
      ],
    );

    // clear cart
    await CartQueries.clearCart(userId);

    return successResponse(
      res,
      { orderId },
      "Payment verified and order created",
    );
  } catch (err) {
    console.error(
      "Razorpay verifyPayment error:",
      err && err.stack ? err.stack : err,
    );
    return errorResponse(res, err.message || "Failed to verify payment");
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
