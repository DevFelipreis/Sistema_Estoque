import { Router } from "express";

import { createUser, deleteUser, getUser, loginAdmin, loginUser, updateUser } from "../controllers/users";
import { userValidation } from "../middlewares/user";
import { createProduct, deleteProduct, entryProduct, getProduct, updateProduct } from "../controllers/product";
import { productValidation, productValidationEntry, productValidationId, productValidationName } from "../middlewares/product";
import { loginValidation } from "../middlewares/loginvalidation";

const router = Router();

router.post("/login", loginUser);
router.post("/login/admin", loginAdmin);

//router.use(loginValidation);

router.get("/users", getUser);
router.post("/users", createUser);
router.put("/users", userValidation, updateUser)
router.delete("/users", userValidation, deleteUser)

router.get("/products", getProduct);
router.post("/products", productValidation, productValidationName, createProduct);
router.put("/products", productValidationId, updateProduct);
router.patch("/products", productValidationId, productValidationEntry, entryProduct);
router.delete("/products", productValidationId, deleteProduct);

export default router;