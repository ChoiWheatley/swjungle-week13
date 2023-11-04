const express = require("express");
const router = express.Router();
const { Post } = require("../models");

router.post("/post", async (req, res) => {
  const { title, content, author } = req.body;
  const post = await Post.create({ title, content, author });

  // console.log(post);

  res.status(201).json({ data: post });
});

module.exports = router;
