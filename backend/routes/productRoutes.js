import express from "express"
import { CreateProduct, getAllProducts, getSingleProduct,updatingProduct } from "../controllers/productControllers.js";


const router = express.Router();


router.route("/products").get(getAllProducts)
router.route('/products/:id').get(getSingleProduct)
router.route('/admin/products').post(CreateProduct)
router.route('/admin/products/:id').put(updatingProduct)



export default router;