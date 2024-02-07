import express from "express";
import { createUser, findUser } from "./controller.mjs";
import {
  signupKeyValidate,
  loginKeyValidate,
  hashPassword,
  createJWTToken,
  verifyToken,
} from "./middleware.mjs";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await findUser(req.user._id);
    res.render("index", user);
  } catch (error) {
    res.status(404).json({ msg: "User not found", error: error.stack });
  }
});

router.get("/sign", (req, res) => {
  res.render("sign");
});

router
  .get("/signup", (req, res) => {
    res.render("signup");
  })
  .post("/signup", signupKeyValidate, hashPassword, async (req, res) => {
    try {
      await createUser(req.body);
      res.status(201).redirect("/sign");
    } catch (error) {
      res
        .status(400)
        .send({ msg: "Failed to create user", error: error.stack });
    }
  });

router.post("/sign", loginKeyValidate, createJWTToken, async (req, res) => {
  res.status(200).render("index", req.user)
});

export default router;
