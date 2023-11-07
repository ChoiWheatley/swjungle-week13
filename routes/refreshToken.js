const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { BlackLists } = require("../models");
require("dotenv").config();

/**
 * access / refresh token 모두를 갱신한다.
 */
router.post("/token/refresh", async (req, res) => {
  // refresh token 유효성 검사
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.sendStatus(401); // no token provided
  }

  /// 기존 토큰을 무효화한다.
  const oldToken = req.headers["authorization"];
  if (oldToken) {
    const accessToken = oldToken.split(" ")[1];
    const blacklist = await BlackLists.findOne({ accessToken });
    if (!blacklist) {
      await BlackLists.create({ accessToken });
    }
  }

  jwt.verify(refreshToken, process.env["SECRET_KEY"], (err, payload) => {
    if (err) {
      return res.status(403).json({ errorMessage: "Token is Invalid!" });
    }
    console.log(`payload: ${payload}`);
    // DO refresh both tokens
    const userId = payload["userId"];
    const accessToken = jwt.sign(
      {
        tokenType: "access",
        userId
      },
      process.env["SECRET_KEY"],
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      {
        tokenType: "refresh",
        userId
      },
      process.env["SECRET_KEY"],
      { expiresIn: "7d" }
    );
    res.status(200).json({
      accessToken,
      refreshToken
    });
  });
});

module.exports = router;
