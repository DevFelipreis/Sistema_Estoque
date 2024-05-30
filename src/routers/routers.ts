import { Router } from "express";

import { createUser, deleteUser, getUser, loginUser, updateUser } from "../controllers/users";
import { userValidation } from "../middlewares/user";

const router = Router();

router.get("/users", getUser);
router.post("/users", createUser);
router.post("/login", loginUser);
router.put("/users", userValidation, updateUser)
router.delete("/users", userValidation, deleteUser)

export default router;