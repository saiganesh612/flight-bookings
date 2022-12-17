const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")

const dbURL = process.env.DB_URL || "mongodb://localhost:27017/flights"
mongoose.connect(dbURL)


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
