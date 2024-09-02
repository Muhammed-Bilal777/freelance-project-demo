import express from "express"
import { createAndUpdateReviews, CreateProduct, deleteProduct, deleteReview, getAllProducts, getProductReview, getSingleProductDetails,updatingProduct } from "../controllers/productControllers.js";
import { isAuthenticatedUser,authorizeRole} from "../middlewares/auth.js";
 


const router = express.Router();


router.route("/products").get(getAllProducts)
router.route('/products/:id').get(getSingleProductDetails)
router.route('/admin/products').post(isAuthenticatedUser,authorizeRole('admin'),CreateProduct)
router.route('/admin/products/:id').put(isAuthenticatedUser,authorizeRole('admin'),updatingProduct)
router.route('/admin/products/:id').delete(isAuthenticatedUser,authorizeRole('admin'),deleteProduct)


router.route('/products/reviews').put(isAuthenticatedUser,createAndUpdateReviews)
router.route('/reviews').get(isAuthenticatedUser,getProductReview)
router.route('/admin/reviews').delete(isAuthenticatedUser,authorizeRole('admin'),deleteReview)


export default router;