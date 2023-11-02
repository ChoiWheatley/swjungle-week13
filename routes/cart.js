const express = require("express");
const Cart = require("../schemas/cart");
const Goods = require("../schemas/goods");
const router = express.Router();

/**
 * 1. 장바구니 목록조회
 * 2. 장바구니에 상품추가
 * 3. 장바구니 상품제거
 * 4. 장바구니 상품 수량 수정
 */

router.get("/carts", async (req, res) => {
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

module.exports = router;
