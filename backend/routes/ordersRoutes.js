import express from "express";
import { createOrder, deleteOrder, getAllOrder, getOrderDetails, updateOrderDetails, userOrders } from "../controllers/orderControllers.js";
import { authorizeRole, isAuthenticatedUser } from "../middlewares/auth.js";

const router=express.Router();

router.route('/orders/new').post(isAuthenticatedUser ,createOrder)
router.route('/me/orders').get(isAuthenticatedUser,userOrders)
router.route('/orders/:id').get(isAuthenticatedUser,getOrderDetails)

router.route('/admin/orders').get(isAuthenticatedUser,authorizeRole('admin'),getAllOrder)
router.route('/admin/orders/:id').put(isAuthenticatedUser,authorizeRole('admin'),updateOrderDetails)
router.route('/admin/orders/:id').delete(isAuthenticatedUser,authorizeRole('admin'),deleteOrder)
export default router;