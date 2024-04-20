const express = require("express");
const router = express.Router();
const { signup, requestOTP, verifyOTP, login } = require("../controller/index");


router.post("/login",login)
router.post("/signup", signup);
router.get("/verify-otp",verifyOTP)
router.post("/request-otp", requestOTP);


// exporting the router
module.exports = router;