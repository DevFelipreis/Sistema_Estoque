import { Router } from "express";

import { createUser, deleteUser, getUser, loginUser, updateUser } from "../controllers/users";
import { userValidation } from "../middlewares/user";
import { createProduct, deleteProduct, entryProduct, getProduct, updateProduct } from "../controllers/product";
import { productValidation, productValidationEntry, productValidationId } from "../middlewares/product";
import { loginValidation } from "../middlewares/loginvalidation";

const router = Router();

router.get("/users", getUser);
router.post("/users", createUser);
router.post("/login", loginUser);
router.put("/users", userValidation, updateUser)
router.delete("/users", userValidation, deleteUser)

//router.use(loginValidation);
router.get("/products", getProduct);
router.post("/products", productValidation, createProduct);
router.put("/products", productValidationId, updateProduct);
router.patch("/products", productValidationId, productValidationEntry, entryProduct);
router.delete("/products", productValidationId, deleteProduct);

export default router;