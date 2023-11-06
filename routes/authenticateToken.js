const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // No token provided

  jwt.verify(token, "secretOrPrivateKey", (err, user) => {
    if (err) return res.sendStatus(403); // Token is invalid
    req.user = user;
    next(); // Token is valid, continue with the next middleware
  });
}

module.exports = authenticateToken;
