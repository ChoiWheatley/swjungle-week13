const express = require("express");
const Goods = require("../schemas/goods");
const Cart = require("../schemas/cart");
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

router.param("goodsId", async (req, res, next, id) => {
  const goods = await Goods.findOne({ goodsId: id });
  if (!goods) {
    return res.status(404).json({
      success: false,
      errorMessages: `그런 goodsId(${id})는 없는데요 선생님`,
    });
  }
  req.goods = goods;
  next();
});

router.get("/goods/carts", async (req, res) => {
  // 장바구니 목록조회
  const carts = await Cart.find({});
  const goodsIds = carts.map((e) => e.goodsId);
  const goods = await Goods.find({ goodsId: goodsIds });
  const results = carts.map((e) => {
    return {
      quantity: e.quantity,
      goods: goods.find((item) => item.goodsId === e.goodsId),
    };
  });

  res.json({ success: true, carts: results });
});

router.get("/goods/:goodsId", async (req, res) => {
  return res.json({ success: true, data: req.goods });
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
  await Goods.deleteOne({ goodsId: req.goods.goodsId });
  return res.json({ success: true, data: req.goods });
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

router.post("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.find({ goodsId: goodsId });
  if (cart.length) {
    return res.json({
      success: false,
      errorMessage:
        "이미 장바구니에 존재하는 상품입니다. 원한다면 PUT 메서드를 사용해 주세요",
    });
  }

  await Cart.create({ goodsId: Number(goodsId), quantity: quantity });
  res.json({ result: "success" });
});

router.put("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  if (Number(quantity) < 1) {
    return res.status(400).json({
      success: false,
      errorMessage: `아니, 님 (${quantity})개를 어떻게 삽니까? 😡`,
    });
  }

  const cart = await Cart.find({ goodsId: goodsId });
  if (cart.length === 0) {
    return res.json({
      success: false,
      errorMessage: `해당 상품(${goodsId})이 장바구니에 없습니다. POST 요청으로 장바구니에 상품을 추가해주세요.`,
    });
  }

  await Cart.updateOne({ goodsId: goodsId }, { $set: { quantity } });

  res.json({ sucess: true });
});

router.delete("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const cart = await Cart.findOne({ goodsId: goodsId });
  if (!cart) {
    return res.status(404).json({
      success: false,
      errorMessage: `해당 상품(${goodsId})이 장바구니에 없습니다.`,
    });
  }

  await Cart.deleteOne({ goodsId: goodsId });
  res.json({ success: true });
});

module.exports = router;
