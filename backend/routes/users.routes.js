import express from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../controller/users.controller.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

router.use((_req, res) => {
  res.status(404).json({
    message: "Route không tồn tại",
    success: false,
  });
});

export default router;
