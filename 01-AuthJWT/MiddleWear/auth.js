const jwt = require("jsonwebtoken");
const User = require("../models/User")

const isLoggedIn = async (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Killer ")) {
        return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const verified = jwt.verify(token, process.env.SECRECT_TOKEN);
        req.user = await User.findById(verified._id).select("-password");

        console.log(req.user);
        if(!req.user){
            return res.status(401).json({ message: "user Not found" });
        }
        next();
    } catch (err) {
        return res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = isLoggedIn;
