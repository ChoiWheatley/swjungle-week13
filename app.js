const express = require("express");
const commentsRouter = require("./routes/comments");
const postsRouter = require("./routes/posts");
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
app.use("/api", [goodsRouter]);
app.use(express.static("static"));

/**
 * !SECTION - Middlewares
 */
