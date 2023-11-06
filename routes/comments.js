const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const authenticateToken = require("./authenticateToken");

router.post("/comment", [authenticateToken], async (req, res, next) => {
  const { content, postId } = req.body;
  const userId = req.user.userId;

  try {
    console.log(content, postId);
    const comment = await Comments.create({ content, postId, userId });
    res.status(201).json({ data: comment });
  } catch (e) {
    console.log("💀", e);
    next(e);
  }
});

router.param(
  "commentId",
  /**
   * ⭐️ hooks every request which includes `:commentId` path.
   * Does id validation and query instance.
   */
  async (req, res, next, id) => {
    try {
      const idnum = Number(id);
      const comment = await Comments.findOne({
        where: { commentId: idnum },
      });

      if (comment === null) {
        console.log("💀 no comment found!");
        return res.sendStatus(404);
      }
      console.log("[*] comment: ", JSON.stringify(comment, null, 4));
      req.comment = comment;

      next();
    } catch (e) {
      console.log("💀", e);
      next(e);
    }
  }
);

router.get("/comment", async (req, res) => {
  const comments = await Comments.findAll({
    order: [["createdAt", "DESC"]],
  });
  res.json({ data: comments });
});

router.get("/comment/:commentId", async (req, res) => {
  res.json({ data: req.comment });
});

router.delete("/comment/:commentId", [authenticateToken], async (req, res) => {
  if (req.user.userId !== req.comment.userId) {
    return res
      .status(403)
      .json({ errorMessage: "글쓴이만 수정할 수 있습니다..." });
  }
  await req.comment.destroy();
  res.sendStatus(200);
});

router.put("/comment/:commentId", [authenticateToken], async (req, res) => {
  /**
   * PUT /comment/1
   * {"content": "good"}
   */
  if (req.user.userId !== req.comment.userId) {
    return res
      .status(403)
      .json({ errorMessage: "글쓴이만 수정할 수 있습니다..." });
  }
  const { content } = req.body;

  if (content) {
    req.comment.content = content;
  }

  ///FIXME - `save` 단에서 form 검사를 수행할 수 있는 방법 찾기
  await req.comment.save();

  res.sendStatus(200);
});
module.exports = router;
