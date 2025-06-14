const express = require("express");
const isLoggedIn = require("../MiddleWear/auth");
const router = express.Router();


// @route api/check
router.get('/check', isLoggedIn, (req, res) => {
    res.send("You are verified");
});

module.exports = router;