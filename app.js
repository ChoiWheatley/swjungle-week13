const express = require("express");
const commentsRouter = require("./routes/comments");
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

app.get("/", (_req, res) => {
  res.send("Hello, World!");
});

app.listen(port, async () => {
  console.log("[*] ", port, "포트로 서버가 열렸어요! ️💗");
});

/// SECTION - Middlewares

app.use(cookieParser());
app.use(express.json()); // use builtin JSON parser middleware
app.use("/api", [commentsRouter, postsRouter, usersRouter]);
app.use(express.static("static"));

/// !SECTION - Middlewares
