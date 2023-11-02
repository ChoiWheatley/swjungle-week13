const express = require("express");
const goodsRouter = require("./routes/goods");
const cartRouter = require("./routes/cart");
const connect = require("./schemas");

const app = express();
connect();
const port = 3000;

app.get("/", (_req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요! ♥️");
});

/**
 * SECTION - Middlewares
 */

app.use(express.json()); // use builtin JSON parser middleware
app.use("/api", [goodsRouter, cartRouter]);
app.use(express.static("static"));

/**
 * !SECTION - Middlewares
 */
