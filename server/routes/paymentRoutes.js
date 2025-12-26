const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const { razorpayConfig } = require('../config/razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay(razorpayConfig);

// Create order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", razorpayConfig.key_secret)
      .update(sign)
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      res.status(200).json({ message: "Payment verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Error verify payment:", error);
    res.status(500).json({ message: "Error verifying payment", error: error.message });
  }
});

module.exports = router;
