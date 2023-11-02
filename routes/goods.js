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

router.get("/goods/:goodsId", async (req, res) => {
  const { goodsId } = req.params;
  const detail = await Goods.find({ goodsId: goodsId });

  if (detail) {
    return res.json({ success: true, data: detail });
  } else {
    return res
      .status(404)
      .json({ success: false, errorMessage: "데이터가 없습니다 ❌" });
  }
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

router.delete("/goods/:goodsId", async (req, res) => {
  const { goodsId } = req.params;
  const goods = await Goods.findOne({ goodsId });
  if (goods) {
    await Goods.deleteOne({ goodsId });
    return res.json({ success: true, data: goods });
  } else {
    return res
      .status(404)
      .json({ success: false, errorMessage: "데이터가 없습니다 ❌" });
  }
});

module.exports = router;
