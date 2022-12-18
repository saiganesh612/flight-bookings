const mongoose = require("mongoose")

const FlightSchema = new mongoose.Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    From: String,
    To: String,
    departureTime: Date,
    status: {
        type: String,
        default: "Active"
    },
    tickets: {
        type: Number,
        default: 60
    },
    passengers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking"
        }
    ]
})

module.exports = mongoose.model("Flight", FlightSchema)
