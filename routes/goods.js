const express = require("express");
const Goods = require("../schemas/goods");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("default uri for goods.js GET Method!");
});

router.get("/about", (req, res) => {
  res.send("goods.js `about` Path");
});

router.get("/goods", async (req, res) => {
  const data = await Goods.find();
  if (data) {
    console.log("found!: ", Array(data));
    res.json({ success: true, data: data });
  } else {
    res
      .status(404)
      .json({ success: false, errorMessage: "데이터가 없습니다." });
  }
});

router.get("/goods/:goodsId", (req, res) => {
  const { goodsId } = req.params;
  const [detail] = goods.filter((goods) => goods.goodsId === Number(goodsId));
  res.json({ detail });
});

router.post("/goods", async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body;
  const goods = await Goods.find({ goodsId });
  if (goods.length > 0) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "이미 있는 데이터라구 친구 👿" });
  }

  const createdGoods = await Goods.create({
    goodsId,
    name,
    thumbnailUrl,
    category,
    price,
  });

  res.json({ goods: createdGoods });
});

module.exports = router;
