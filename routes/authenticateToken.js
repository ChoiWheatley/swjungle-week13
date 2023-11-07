const jwt = require("jsonwebtoken");
const { BlackLists } = require("../models");
require("dotenv").config();

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // No token provided

  jwt.verify(token, process.env["SECRET_KEY"], async (err, user) => {
    if (err) return res.sendStatus(403); // Token is invalid

    // search token from blacklist
    const blacklist = await BlackLists.findOne(
      { where: { accessToken: token } }
    );
    if (blacklist) {
      return res.status(403).json({ errorMessage: "토큰이 블랙리스트에 있습니다." });
    }

    req.user = user;
    next(); // Token is valid, continue with the next middleware
  });
}

module.exports = authenticateToken;
