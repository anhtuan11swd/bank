import express from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  handleUsers404,
  updateUser,
} from "../controller/users.controller.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

router.use(handleUsers404);

export default router;
