import { Router } from "express";
import { createUser, deleteUser, getUser, loginUser, updateUser } from "../controllers/users";
import { userValidationId, userValidationProfession } from "../middlewares/user";
import { createProduct, deleteProduct, entryProduct, getProduct, updateProduct } from "../controllers/product";
import { productValidation, productValidationId } from "../middlewares/product";
import { loginValidation } from "../middlewares/loginvalidation";

const router = Router();

router.post("/login", loginUser);

router.use(loginValidation);

router.get("/users", getUser);
router.post("/users", userValidationProfession, createUser);
router.put("/users", userValidationId, updateUser)
router.delete("/users", userValidationId, deleteUser)

router.get("/products", getProduct);
router.get("/products/:id", getProduct)
router.post("/products", productValidation, createProduct);
router.put("/products", productValidationId, updateProduct);
router.patch("/products", productValidationId, entryProduct);
router.delete("/products", productValidationId, deleteProduct);

export default router;