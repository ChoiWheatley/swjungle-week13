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

module.exports = router;
