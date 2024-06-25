import { Router } from "express";
import { createUser, deleteUser, getUser, loginUser, updateUser, updateUserAll } from "../controllers/users";
import { updateAtivo, updateDateLogin, userValidationId, userValidationProfession } from "../middlewares/user";
import { createProduct, deleteProduct, entryProduct, getProduct, updateProduct } from "../controllers/product";
import { productValidation, productValidationId } from "../middlewares/product";
import { loginValidation } from "../middlewares/loginvalidation";
import { createSell } from "../controllers/sell";

const router = Router();

router.use(updateAtivo);
router.use(updateDateLogin);

router.post("/login", loginUser);

router.use(loginValidation);

router.get("/users", getUser);
router.get("/users/:id", getUser);
router.post("/users", userValidationProfession, createUser);
router.put("/users", userValidationId, updateUserAll)
router.patch("/users", updateUser)
router.delete("/users", userValidationId, deleteUser)

router.get("/products", getProduct);
router.get("/products/:id", getProduct)
router.post("/products", productValidation, createProduct);
router.put("/products", productValidationId, updateProduct);
router.patch("/products", productValidationId, entryProduct);
router.delete("/products", productValidationId, deleteProduct);

router.post("sell", productValidation, createSell);

export default router;