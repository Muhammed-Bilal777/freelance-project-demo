import express from "express"
import { deleteUser, forgotPassword, getAllusers, getCurrentUser, getUserDetials, registerUser, resetPassword, updatePassword, UpdateUserDetails, updateUserProfile, uploadAvatar, userLogin, userLogout } from "../controllers/userControllers.js";
import { authorizeRole, isAuthenticatedUser } from "../middlewares/auth.js";

const router=express.Router();


router.route('/register').post(registerUser);
router.route('/login').post(userLogin)
router.route('/logout').get(userLogout)

router.route('/me/password/update').put(isAuthenticatedUser,updatePassword)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)

router.route('/me').get(isAuthenticatedUser,getCurrentUser)
router.route('/me/update').put(isAuthenticatedUser,updateUserProfile)
router.route("/me/upload_avatar").put(isAuthenticatedUser, uploadAvatar);

router.route('/admin/users').get(isAuthenticatedUser,authorizeRole("admin"),getAllusers)
router.route('/admin/users/:id').get(isAuthenticatedUser,authorizeRole("admin"),getUserDetials)
router.route('/admin/users/:id').delete(isAuthenticatedUser,authorizeRole("admin"),deleteUser)
router.route('/admin/users/:id').put(isAuthenticatedUser,authorizeRole("admin"),UpdateUserDetails)
export default router;