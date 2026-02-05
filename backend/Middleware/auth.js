const { verifyJWT } = require("../utils/generateToken");

async function verifyUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please sign in.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = await verifyJWT(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    req.user = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
}

module.exports = verifyUser;
