const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

// @route /api/users/register 
router.post("/register" ,async (req, res) => {
    //console.log(req.body);
    const {name, email, password} = req.body;

    //console.log(name, email, password);

    const emailExist = await User.findOne({email});
    if(emailExist){
        return res.status(400).json({message : "User Already Exist"});
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name, 
            email,
            password: hashPassword,
        });
        await user.save();

        const payload = {_id : user._id};
        jwt.sign(payload, process.env.SECRECT_TOKEN, {expiresIn: "40hr"}, (err,token) => {
            if(err) throw err;

            res.status(201).json({
                user: {
                    _id : user._id,
                    name: user.name,
                    email : user.email,
                },
                token
            });
        });
        
    } catch (error) {
        res.status(500).send("Server Error");  
    }
});

// @route /api/users/login
router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        let user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message : "Invalid Credential"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const payload = {_id : user._id};
            jwt.sign(payload, process.env.SECRECT_TOKEN, {expiresIn: "40hr"}, (err,token) => {
                if(err) throw err;

                res.status(201).json({
                    user: {
                        _id : user._id,
                        name: user.name,
                        email : user.email,
                    },
                    token
                });
            });
        }
        else{
            return res.status(400).json({message : "Invalid Credential"});
        }
    } catch (error) {
        res.status(500).send("Server Error");  
    }
})


module.exports = router;
