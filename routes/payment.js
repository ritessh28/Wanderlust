const express = require("express");
const router = express.Router();
const asyncwrap = require("../utils/wrapasync.js");
const { isLoggedIn } = require("../middleware.js");
const paymentController = require("../controllers/payment.js");

router.post("/verify", isLoggedIn, asyncwrap(paymentController.verifyPayment));

module.exports = router;
