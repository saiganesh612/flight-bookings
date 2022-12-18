const mongoose = require("mongoose")

const BookingSchema = new mongoose.Schema({
    name: String,
    From: String,
    To: String,
    flightId: String,
    price: Number,
    departureDate: Date,
    travellers: [
        {
            _id: false,
            name: String,
            age: Number
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model("Booking", BookingSchema)
