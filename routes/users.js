const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const jwt = require("jsonwebtoken");

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
  if (await Users.findOne({ nickname: nickname })) {
    return res.status(400).json({
      errorMessage: "💀 중복된 닉네임입니다~",
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

  // 사용자 정보를 JWT로 생성
  const userJWT = jwt.sign(
    user.toJSON(),
    "secretOrPrivateKey", /// TODO - secret key .env 파일에 저장하여 꺼내쓰기
    { expiresIn: "1h" } // JWT의 인증 만료시간을 1시간으로 설정 /// TODO - refresh token + expiresIn: 15min
  );

  // userJWT 변수를 sparta 라는 이름을 가진 쿠키에 Bearer 토큰 형식으로 할당
  res.cookie("sparta", `Bearer ${userJWT}`);
  return res.status(200).end();
});

router.post("/logout", (req, res) => {
  res.clearCookie("sparta");
  res.sendStatus(200);
});

module.exports = router;
