const { verifyJWT } = require("../utils/generateToken");

async function verifyUser(req, res, next) {
  try {
    let token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(200).json({
        success: false,
        message: "Please sign in",
      });
    }
    try {
      let user = await verifyJWT(token);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Please Sign in",
        });
      }
      req.user = user.id;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Token Missing",
    });
  }
}

module.exports = verifyUser;
