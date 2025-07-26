import jwt from "jsonwebtoken"

export const authenticateUser = (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: decoded.id, role: decoded.role }
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    })
  }
}

export const optionalAuth = (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "")

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = { id: decoded.id, role: decoded.role }
    }

    next()
  } catch (error) {
    next()
  }
}

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ success: false, message: "Access denied. No role found." })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Your role (${req.user.role}) is not authorized to access this resource.`,
      })
    }
    next()
  }
}
