if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")

const authRoutes = require("./routes/user.routes")
const flightOperationRoutes = require("./routes/flight_ops.routes")
const bookingOperationRoutes = require("./routes/bookings_ops.routes")

const dbURL = process.env.DB_URL || "mongodb://localhost:27017/flight"
mongoose.connect(dbURL)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const db = mongoose.connection
db.on("error", console.error.bind(console, "Mongoose connection denied."))
db.once("open", () => {
    console.log("Mongoose connection established.")
})

app.use("/api", authRoutes)
app.use("/api", flightOperationRoutes)
app.use("/api", bookingOperationRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
