const jwt = require("jsonwebtoken")
const createError = require("http-errors")

const verifyAccessToken = (req, res, next) => {
    if (!req.headers['authorization']) return next(createError.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    jwt.verify(token, process.env.JWTPRIVATEKEY, (err, payload) => {
        if (err) {
            const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
            res.status(401).send({ message })
            return
        }
        req.payload = payload
        next()
    })
}

module.exports = { verifyAccessToken }
