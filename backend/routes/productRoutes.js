import express from "express"
import { CreateProduct, deleteProduct, getAllProducts, getSingleProduct,updatingProduct } from "../controllers/productControllers.js";
import { isAuthenticatedUser,authorizeRole} from "../middlewares/auth.js";


const router = express.Router();


router.route("/products").get(getAllProducts)
router.route('/products/:id').get(getSingleProduct)
router.route('/admin/products').post(isAuthenticatedUser,authorizeRole('admin'),CreateProduct)
router.route('/admin/products/:id').put(isAuthenticatedUser,authorizeRole('admin'),updatingProduct)
router.route('/admin/products/:id').delete(isAuthenticatedUser,authorizeRole('admin'),deleteProduct)


export default router;