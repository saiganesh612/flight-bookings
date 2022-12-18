const express = require("express")
const router = express.Router()
const User = require("../models/user")
const Flight = require("../models/flights")
const { verifyAccessToken } = require("../middlewares/user.validate")

router.post("/add-new-flight", verifyAccessToken, async (req, res) => {
    const data = req.body
    try {
        const newFlight = new Flight({
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            From: data.from,
            To: data.to,
            departureTime: new Date(data.date + ' ' + data.time)
        })
        await newFlight.save()
        res.status(200).json({ "message": "Success" })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ "message": err ? err : "Something went wrong" })
    }
})

router.post("/remove-flight", verifyAccessToken, async (req, res) => {
    const { flightId } = req.body
    try {
        const flight = await Flight.findOne({ _id: { $eq: flightId } })
        if (!flight) throw "There is no flight with this ID."

        const doc = await Flight.findOneAndDelete({ _id: { $eq: flightId } })
        res.status(200).json({ "message": "Removed Successfully." })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ "message": err ? err : "Something went wrong" })
    }
})

router.get("/get-passengers-list/:flightId", verifyAccessToken, async (req, res) => {
    const { payload } = req
    const { flightId } = req.params
    try {
        const user = await User.findOne({ _id: { $eq: payload._id } })
        if (!user) throw "There is no user with this ID."
        if (!user.isAdmin) throw "You don't have permission to view this data."

        const flight = await Flight.findOne({ _id: { $eq: flightId } })
            .populate({ path: "passengers", model: "Booking" })
        if (!flight) throw "There are no flights available with this flightID."

        res.status(200).json({ "data": flight })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ "message": err ? err : "Something went wrong" })
    }
})

module.exports = router
