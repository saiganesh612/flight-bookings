const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/user")

router.post("/register", async (req, res) => {
    const info = req.body
    try {
        const user = await User.findOne({ email: { $eq: info.email } })
        if (user) throw "A user with this email already registered."

        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(info.password, salt)

        const newUser = new User({
            name: info.name,
            email: info.email,
            password: hashPassword,
            isAdmin: info.name === "Admin" ? true : false
        })
        await newUser.save()
        res.status(200).json({ "message": "User created successfully." })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ "message": err ? err : "Incorrect email or password" })
    }
})

router.post("/login", async (req, res) => {
    const info = req.body
    try {
        const user = await User.findOne({ email: { $eq: info.email } })
        if (!user) throw "There is no user registered with this email."

        const validPassword = bcrypt.compare(info.password, user.password)
        if (!validPassword) throw "Incorrect Email or Password"

        const token = user.generateAuthToken()
        const userObj = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            bookings: user.bookings,
            token
        }
        res.status(200).json({ user: userObj, "message": "LoggedIn Successfully" })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ "message": err ? err : "Incorrect email or password" })
    }
})

module.exports = router
