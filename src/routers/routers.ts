import { Router } from "express";

import { createUser, loginUser } from "../controllers/users";

const router = Router();

router.post("/users", createUser);
router.post("/login", loginUser);

export default router;