const jwt = require("jsonwebtoken");
require("dotenv").config();

const { JWT_SECRET } = process.env;

/**
 * Generate JWT Token
 * @param {Object} payload - user payload (id, email etc.)
 * @returns {String} token
 */
async function generateJWT(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d", // ✅ token valid for 7 days
  });
}

/**
 * Verify JWT Token
 * @param {String} token
 * @returns {Object|false}
 */
async function verifyJWT(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return false;
  }
}

/**
 * Decode JWT without verification (not for auth)
 * @param {String} token
 * @returns {Object|null}
 */
async function decodeJWT(token) {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateJWT,
  verifyJWT,
  decodeJWT,
};
