const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    const token = req.body.token;

    if (!token) {
      console.warn("No token provided");
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    return next();
  } catch (error) {
    console.error("Error in authMiddleware:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).send({ success: false, message: "Token expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).send({ success: false, message: "Invalid token" });
    }

    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
}

module.exports = authMiddleware;
