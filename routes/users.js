const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const { BlackLists } = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/signup", async (req, res, next) => {
  const { nickname, password, passwordConfirm } = req.body;

  ///NOTE - Validation Logic
  if (password !== passwordConfirm) {
    return res.status(401).json({ errorMessage: "💀 패스워드가 서로 달라영!" });
  }

  if (password.length < 4) {
    return res
      .status(401)
      .json({ errorMessage: "💀 패스워드는 최소 4자 이상이어야 합니다." });
  }

  if (nickname === password) {
    return res
      .status(401)
      .json({ errorMessage: "💀 닉네임은 비밀번호와 동일할 수 없습니다." });
  }

  if (!nickname.match(/^[a-zA-Z0-9]{3,}$/)) {
    return res.status(401).json({
      errorMessage:
        "💀 닉네임은 최소 3자 이상, 알파벳 대소문자, 숫자로 구성되어야 합니다.",
    });
  }
  const user = await Users.findOne({ where: { nickname: nickname } });
  if (user) {
    return res.status(400).json({
      errorMessage: `💀 중복된 닉네임입니다~(${user.nickname})`,
    });
  }

  try {
    /// TODO - password 암호화 결과를 저장
    const user = await Users.create({ nickname, password });
    res.status(201).json({ data: user });
  } catch (error) {
    console.log("💀", error);
    next(error);
  }
});

router.post("/login", async (req, res) => {
  // 사용자 정보
  const { nickname, password } = req.body;
  const user = await Users.findOne({ where: { nickname: nickname } });
  if (!user) {
    return res.status(404).json({ errorMessage: "없는 계정입니다." });
  }

  /// TODO - password 암호화 결과를 비교
  if (user.password !== password) {
    return res
      .status(400)
      .json({ errorMessage: "비밀번호가 일치하지 않습니다." });
  }

  // 기존 access token을 비활성화한다. [optional]
  const oldAccessToken = req.headers["authorization"];
  if (oldAccessToken) {
    BlackLists.create({ accessToken: oldAccessToken.split(" ")[1] });
  }

  // 사용자 정보를 JWT로 생성
  const accessToken = jwt.sign(
    {
      tokenType: "access",
      userId: user.userId
    },
    process.env["SECRET_KEY"],
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    {
      tokenType: "refresh",
      userId: user.userId
    },
    process.env["SECRET_KEY"],
    { expiresIn: "15m" }
  );

  res.setHeader("Authorization", `Bearer ${accessToken}`);
  return res.status(200).json({ accessToken, refreshToken });
});

router.post("/logout", (req, res) => {
  // now this behavior do nothing. Access token will expire on client
  const accessToken = req.headers["authorization"];
  if (accessToken) {
    const token = accessToken.split(" ")[1];
    const found = BlackLists.findOne({ where: { accessToken: token } })
    if (!found) {
      BlackLists.create({ accessToken: token });
    }
  }
  res.sendStatus(200);
});

router.get("/testjwt", (req, res) => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token) {
    return res.status(404).json({ errorMessage: "토큰이 없습니다~" });
  }
  try {
    const payload = jwt.verify(token.split(" ")[1], process.env["SECRET_KEY"]);
    return res.json({ data: payload });
  } catch (e) {
    console.log("💀", e);
    return res.sendStatus(403);
  }
});

module.exports = router;
