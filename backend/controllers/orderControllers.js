import catchAsync from "../middlewares/catchAsync.js"
import Order from "../models/orderModel.js"
import sendError from "../utils/sendError.js";
import Product from "../models/productModel.js"



//creating new order  => /api/v1/orders/new
export const createOrder = catchAsync(async (req,res)=>{

    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
      } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        user : req.user._id
    })

    res.status(200).send({
        message:"Ordered successfull",
        order
    })
})

// current logged in User Orders
export const userOrders = catchAsync(async(req,res,next)=>{

    const orders = await Order.find({ user :req?.user?._id})

    if(orders.length === 0){
        return next(new sendError("There are currently no orders",404));

    }

    res.status(200).send({
        totalOrder :orders.length,
        orders
    })
})


//get single order details by id

export const getOrderDetails = catchAsync(async(req,res,next)=>{
    const {id} =req.params

    const order = await Order.findById(id).populate('user',"name email");

    if(!order){
        return next(new sendError("order not found with this id",404))
    }

    res.status(200).send({
        order,
        
    })
})

//get all orders

export const getAllOrder =catchAsync(async(req,res,next)=>{
    let orders = await Order.find();

    res.status(200).send({
        totalOrder :  orders.length,
        orders
    })
})


//get all orders

export const updateOrder =catchAsync(async(req,res,next)=>{
    let orders = await Order.find();

    res.status(200).send({
        totalOrder :  orders.length,
        orders
    })
})

//update order details   /admin/orders/update

export const updateOrderDetails =catchAsync(async (req,res,next)=>{

    let order = await Order.findById(req?.params?.id);
    if(!order){
        return next(new sendError("order not found with id",403))
    }

    if (order?.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400));
      }

    order?.orderItems.forEach(async (item)=>{
        const product= await Product.findById(item.product.toString());
         
        
        if(!product){
            return next(new sendError("product not found with id",403))
        } 

        product.stock=product.stock - item.quantity;
        await product.save({ validateBeforeSave: false });

        
    })

    order.orderStatus=req?.body?.status,
    order.deliveredAt=Date.now();
    await order.save();
    res.status(200).send({
        message : "order updated successfully",
        order
    })
})


//Delete Order by ID

export const deleteOrder =catchAsync(async(req,res,next)=>{
    let order = await Order.findByIdAndDelete(req?.params?.id);

    res.status(200).send({
       message:"Order deleted successfully",
       order
    })
})
