import express from "express";
import {
  getAllUser,
  signupUser,
  loginUser,
} from "../controllers/user-controller.js";
const router = express.Router();

router.get("/", getAllUser);
router.post("/signup", signupUser);
router.post("/login", loginUser);

export default router;
