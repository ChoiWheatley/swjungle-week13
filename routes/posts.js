const express = require("express");
const router = express.Router();
const { Post } = require("../models");

router.post("/post", async (req, res, next) => {
  const { title, content, author } = req.body;

  try {
    const post = await Post.create({ title, content, author });
    res.status(201).json({ data: post });
  } catch (e) {
    console.log("💀", e);
    next(e);
  }
});

router.param("postId", async (req, res, next, id) => {
  try {
    const idnum = Number(id);
    const post = await Post.findOne({
      where: { postId: idnum },
    });

    if (post === null) {
      console.log("💀 no post found!");
      return res.sendStatus(404);
    }
    console.log("[*] post: ", JSON.stringify(post, null, 4));
    req.post = post;

    next();
  } catch (e) {
    console.log("💀", e);
    next(e);
  }
});

router.get("/post", async (req, res) => {
  const posts = await Post.findAll({
    order: [["createdAt", "DESC"]],
    attributes: [
      "postId",
      "title",
      "content",
      "author",
      "createdAt",
      "updatedAt",
    ],
  });
  res.json({ data: posts });
});

router.get("/post/:postId", async (req, res) => {
  res.json({ data: req.post });
});

router.delete("/post/:postId", async (req, res) => {
  await req.post.destroy();
  res.sendStatus(200);
});

router.put("/post/:postId", async (req, res) => {
  /**
   * PUT /post/1
   * {"title": "something", "content": "good"}
   */
  const { title, content } = req.body;

  if (title) {
    req.post.title = title;
  }

  if (content) {
    req.post.content = content;
  }

  ///FIXME - `save` 단에서 form 검사를 수행할 수 있는 방법 찾기
  await req.post.save();

  res.sendStatus(200);
});

module.exports = router;
