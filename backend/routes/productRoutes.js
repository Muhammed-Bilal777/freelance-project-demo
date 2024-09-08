import express from "express"
import { canUserReview, createAndUpdateReviews, CreateProduct, deleteProduct, deleteProductImage, deleteReview, getAdminProducts, getAllProducts, getProductReview, getSingleProductDetails,updatingProduct, uploadProductImages } from "../controllers/productControllers.js";
import { isAuthenticatedUser,authorizeRole} from "../middlewares/auth.js";
 


const router = express.Router();


router.route("/products").get(getAllProducts)
router.route('/products/:id').get(getSingleProductDetails)
router.route('/admin/products').post(isAuthenticatedUser,authorizeRole('admin'),CreateProduct)
router.route('/admin/products/:id').put(isAuthenticatedUser,authorizeRole('admin'),updatingProduct)
router.route('/admin/products/:id').delete(isAuthenticatedUser,authorizeRole('admin'),deleteProduct)
router.route('/admin/products').get(isAuthenticatedUser,authorizeRole('admin'),getAdminProducts)
router.route('/admin/products/:id/upload_images').put(isAuthenticatedUser,authorizeRole('admin'),uploadProductImages)
router.route('/admin/products/:id/delete_image').put(isAuthenticatedUser,authorizeRole('admin'),deleteProductImage)


router.route('/reviews').put(isAuthenticatedUser,createAndUpdateReviews)
router.route('/reviews').get(isAuthenticatedUser,getProductReview)
router.route('/admin/reviews').delete(isAuthenticatedUser,authorizeRole('admin'),deleteReview)

router.route('/can_review').get(isAuthenticatedUser,canUserReview)




export default router;