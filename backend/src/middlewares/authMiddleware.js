import jwt from 'jsonwebtoken';
import User from '../models/User.js';

//authorization-who is user?
export const protectedRoute = async (req, res, next) => {
  try {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      console.error("ACCESS_TOKEN_SECRET environment variable is not set");
      return res.status(500).json({ message: "Server configuration error" })
    }

    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "No access token found" })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    } catch (err) {
      console.error(err)
      return res.status(403).json({ message: "Invalid or expired access token" })
    }

    const user = await User.findById(decoded.userId).select("-hashedPassword")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Error in authorizing jwt in authMiddleware", error)
    res.status(500).json({ message: "System error" })
  }
}
