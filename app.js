const express = require("express");
const goodsRouter = require("./routes/goods");
const app = express();
const port = 3000;

app.get("/", (_req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요! ♥️");
});

app.use("/api", [goodsRouter]);

app.use(express.static("static"));
