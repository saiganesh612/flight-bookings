const express = require("express")
const router = express.Router()
const User = require("../models/user")
const Flight = require("../models/flights")
const Booking = require("../models/bookings")
const { verifyAccessToken } = require("../middlewares/user.validate")

// Search flights
router.post("/search-flights", async (req, res) => {
    const info = req.body
    const date = new Date(info.date)
    try {
        const flights = await Flight.find(
            {
                $and: [
                    { $and: [{ startDate: { $lte: date } }, { endDate: { $gte: date } }] },
                    { $and: [{ From: { $eq: info.from } }, { To: { $eq: info.to } }] }
                ]
            },
            { passengers: 0 }
        )
        res.status(200).json({ data: flights })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ "message": err ? err : "Something went wrong." })
    }
})

// book tickets
router.post("/book-ticket/:flightId", verifyAccessToken, async (req, res) => {
    const { flightId } = req.params
    const info = req.body
    try {
        const user = await User.findOne({ _id: { $eq: req.payload._id } })
        if (!user) throw "There is no user with this ID."

        const flight = await Flight.findOne({ _id: { $eq: flightId } })
        if (!flight) throw "There is no flight with this ID."
        if (flight.status !== "Active") throw "This flight is no longer available for booking."
        if (!flight.tickets) throw "Currently no tickets available for this flight."

        const newBooking = new Booking({
            name: flight.name,
            From: flight.From,
            To: flight.To,
            flightId: flight._id.toString(),
            price: info.price,
            departureDate: info.departureDate,
            travellers: [...info.travellers]
        })
        await newBooking.save()

        flight.tickets -= 1
        flight.passengers.push(newBooking)
        user.bookings.push(newBooking)
        flight.save()
        user.save()
        res.status(200).json({ "message": "Ticket booked successfully." })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ "message": err ? err : "Something went wrong." })
    }
})

// dashboard
router.get("/dashboard", verifyAccessToken, async (req, res) => {
    const { payload } = req
    try {
        const user = await User.findOne({ _id: { $eq: payload._id } })
            .populate({ path: "bookings", model: "Booking" }).lean()
        if (!user) throw "There is no user with this ID."

        delete user.password
        res.status(200).json({ data: user })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ "message": err ? err : "Something went wrong." })
    }
})

module.exports = router
